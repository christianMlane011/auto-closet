const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    // Login Errors
    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }
    // incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }

    // Signup Errors
    // duplicate error code
    if (err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors - loop through and display each (for example if they provide an invalid email, or a password that is too short)
    if (err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60; // 3 days for cookie

// create a user's jwt that expires in 3 days 
const createToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
}   


module.exports.signup_get = (req, res) =>{
    res.render('signup')
}

module.exports.login_get = (req, res) =>{
    res.render('login')
}


// User is trying to signup with an email and password
module.exports.signup_post = async (req, res) =>{
    const { email, password } = req.body; // Grab the email and password from the request body

    // Try to create a user with this email and password
    try {
        const user = await User.create({ email, password }); 
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } 
     catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) =>{
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } 
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
    
} 

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}