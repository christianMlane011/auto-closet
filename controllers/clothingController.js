const { findOneAndDelete } = require("../models/User");
const User = require("../models/User");
const mongoose = require("mongoose");
const { s3 } = require("./imageUploadController");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config');


module.exports.clothing_get = (req, res) => {
    res.render('clothing');
}

module.exports.clothing_delete = (req, res) => {

    // First element is piece to be deleted, second element is userID, third element is the original file name, used as a key to delete the
    // object from the s3 bucket.
    const items = (req.params.id).split(',');
    //console.log(items);
    
    User.updateOne({ _id: items[1] }, { "$pull": { "images": { _id: items[0] } }}, { safe: true, multi:true }, function(err, obj) {
    }).then(result => {
        res.json({ redirect: '/clothing' });

    })

    const params = {  Bucket: 'auto-closet', Key: items[2] };

    s3.deleteObject(params, function(err, data) {
        if (err){ 
            console.log(err, err.stack);  
        }
        else{
            // console.log('Deleted');                 
        }    
        });

};

module.exports.clothing_outfit =  (req, res) => {
    const top = req.body.userImageTop;
    const bottom = req.body.userImageBottom;

    const token = req.cookies.jwt;
    // console.log(req.body.clothingType);

    if (token){
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err){
                console.log(err.message);
            }
            else{
                //console.log('token: ' , decodedToken);
                let user = await User.findById(decodedToken.id);
                user.outfits.push({top: {clothing: 'Top', link: top}, bottom: {clothing: 'Bottom', link: bottom}});
                // user.images.push({clothing: req.body.clothingType, link: file.location});
                user.save();
                
            }
        });
    }


    res.redirect('/clothing');
}

