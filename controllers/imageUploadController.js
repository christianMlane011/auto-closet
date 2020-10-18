const multer = require("multer");
const multers3 = require("multer-s3");
const aws = require("aws-sdk");
const { awsID, awsSecret } = require('../config');
const path = require("path");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config');


function checkFileType(file, cb){

    // Allowed ext
    const filetypes = /jpeg|jpg/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
}

// AWS info
const ID = awsID;
const SECRET = awsSecret;

// Bucket Info
const BUCKET_NAME = 'auto-closet';

// Create s3 connection
const s3 = new aws.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});



// Create multer s3 storage
var storage = multers3({
    s3: s3,
    bucket: 'auto-closet',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
        const fileExt = file.originalname.split('.')[1];
        if (String(fileExt) !== 'jpg'){
            //console.log('jpg' === String(file.originalname.split('.')[1]));
            return cb('Jpg files only!');
        }    
        cb(null, file.originalname + '-' + Date.now().toString() + '.jpg'); // change uploaded file name to original file name plus date at time of upload
        //checkFileType(file, cb);
    }
})

var upload = multer({ storage: storage });

module.exports.imageUpload_get = (req, res) => {
    res.render('upload');
}

module.exports.imageUpload_post = (req, res) => {

    const file = req.file;
    const image = {clothing: req.body.clothingType, link: req.file.location};
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
                console.log(user._id);
                try {
                    user.images.push(image);
                    user.save();
                } catch (error) {
                    console.log(error);
                }
                
            }
        });
    }
    
    // res.send(file);
    res.redirect('upload');
    
}

module.exports.upload = upload;


  