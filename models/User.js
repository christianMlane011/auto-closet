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
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters']
    }
});

// mongoose hook (middleware) - fire a function before doc is saved to db
userSchema.pre('save', async  function (next) { // regular function instead of arrow function so that we have access to (this)
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
 
// static method to log in user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });

    if (user){
        const auth = await bcrypt.compare(password, user.password);

        if (auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;