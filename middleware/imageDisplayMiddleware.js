const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config');
const User = require("../models/User");


const addImages = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.locals.images = null;
                next();
            }
            else{
                //console.log('token: ' , decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.images = user.images;
                // res.locals.images.forEach(element => {
                //     console.log(element.link);
                // });
                next();
            }
        });
    }
    else{
        res.locals.images = null;
        next();
    }
}

module.exports = { addImages }; 