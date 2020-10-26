const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");


const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters']
    },
    images: [
        {
        clothing: String,
        link: String
        }   
    ],
    outfits: [
        {
        top:    {
                clothing: String,
                link: String
                },
        bottom: {
                clothing: String,
                link: String
                }  
        }
    ]
});

// mongoose hook (middleware) - fire a function before doc is saved to db
userSchema.pre('save', async  function (next) { // regular function instead of arrow function so that we have access to (this)
    
    // PREVOUS ISSUE: Users who made any changes (uploaded or deleted any pictures), where the db had to be saved after, were having their passwords
    // rehashed so that the next time they logged out, they wouldn't be able to log in again with their original.
    // Check if the user is new or the password has been modified, if so, we can rehash the password and change it before saving, otherwise just continue on
    let user = this;
    if (user.isModified('password') || user.isNew){
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } else next();
});
 
 
// static method to log in user
// Get the user and if it exists, use bcrypt to compare the entered password against the stored one
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if (user){
        const auth = await bcrypt.compare(password, user.password);

        if (auth){
            return user;
        }
        // console.log(await bcrypt.hash(this.password, salt));
        // console.log(user.password);
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;