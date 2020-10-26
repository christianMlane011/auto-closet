const { findOneAndDelete } = require("../models/User");
const User = require("../models/User");
const mongoose = require("mongoose");
const { s3 } = require("./imageUploadController");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config');


module.exports.clothing_get = (req, res) => {
    res.render('clothing');
}

module.exports.clothing_delete = async (req, res) => {

    // First element is piece to be deleted, second element is userID, third element is the original file name, used as a key to delete the
    // object from the s3 bucket.
    const items = (req.params.id).split(',');


    /* Get the link of the image that will be deleted, and if it exists in an outfit (as top or bottom piece), delete the picture from "images"  on the 
    database, but not from the s3 bucket, so that the link will not break if the user wants to view the outfit */
    const pieceDeleted = await User.findOne({_id: items[1]}, {images: {"$elemMatch": {_id: items[0]}}}).exec();


    const pieceDeletedLink = pieceDeleted.images[0].link;
    const existsTop = await User.exists({outfits: {"$elemMatch": {"top.link": pieceDeletedLink}}});
    const existsBottom = await User.exists({outfits: {"$elemMatch": {"bottom.link": pieceDeletedLink}}});

    
    // Delete item from the database
    User.updateOne({ _id: items[1] }, { "$pull": { "images": { _id: items[0] } }}, { safe: true, multi:true }, function(err, obj) {
    }).then(result => {
        res.json({ redirect: '/clothing' });
    })


    const params = {  Bucket: 'auto-closet', Key: items[2] };

    // If the item belongs to an outfit, only delete from db, not s3 bucket
    if (existsTop || existsBottom){
        console.log("Cant delete from s3");
    }
    else{
        s3.deleteObject(params, function(err, data) {
            if (err){ 
                console.log(err, err.stack);  
            }
            else{
                console.log('Deleted piece from s3');                 
            }    
        });
    }

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

module.exports.clothing_outfit_get =  (req, res) => {
    res.render('outfits');
}

module.exports.clothing_outfit_delete = async (req, res) => {

    // First element is outfit to be deleted, second element is userID
    // third element is the s3 key for top element, fourth element is s3 key for bottom element
    const items = (req.params.id).split(',');

    // When deleting outfit, check if the images from the outfit are still in the database or if they were previously deleted.
    const outfitDeleted = await User.findOne({_id: items[1]}, {outfits: {"$elemMatch": {_id: items[0]}}}).exec();
    const outfit = outfitDeleted.outfits[0];

    console.log(outfit.top.link);

    const topInDB = await User.exists({images: {"$elemMatch": {link: outfit.top.link}}});
    const bottomInDB = await User.exists({images: {"$elemMatch": {link: outfit.bottom.link}}});
    console.log(bottomInDB);

    // If the images were not deleted, only delete the outfit from the DB, if either of the images were previously deleted and the outfit remains, 
    // remove only the image that no longer exists in the DB from the s3 bucket
    if (!topInDB){
        const params = {  Bucket: 'auto-closet', Key: items[2] };
        s3.deleteObject(params, function(err, data) {
            if (err){ 
                console.log(err, err.stack);  
            }
            else{
                console.log('Top Deleted from s3');                 
            }    
        });
    }
    else{
        console.log("Top was in DB, can't delete from s3");
    }
    
    if (!bottomInDB){
        const params = {  Bucket: 'auto-closet', Key: items[3] };
        s3.deleteObject(params, function(err, data) {
            if (err){ 
                console.log(err, err.stack);  
            }
            else{
                console.log('Bototm Deleted from s3');                 
            }    
        });
    }
    else{
        console.log("Bottom was in DB, can't delete from s3");
    }


    // finally, delete the outfit from the db
    User.updateOne({ _id: items[1] }, { "$pull": { "outfits": { _id: items[0] } }}, { safe: true, multi:true }, function(err, obj) {
    }).then(result => {
        res.json({ redirect: '/clothing/outfits' });

    });

}
