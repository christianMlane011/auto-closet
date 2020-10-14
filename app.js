const express = require('express');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { dbKey } = require("./config");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const multer = require("multer");
const multers3 = require("multer-s3");
//const { uploadFile } = require("./fileUpload");
const aws = require("aws-sdk");
const { s3 } = require("./fileUpload");


const app = express();


// view engine
app.set('view engine', 'ejs');
 
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
//app.use(multer({dest:'userUploads/'}).any());


// Sets storage for multer to /userUploads and 
// names the files with the user's original filename plus
// the current timestamp
// var storage = multers3({
//     destination: (req, file, cb) => {
//       cb(null, 'userUploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname + '-' + Date.now())
//     }
// });

var storage = multers3({
    s3: s3,
    bucket: 'auto-closet',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
      cb(null, file.originalname + '-' + Date.now().toString() + '.jpg'); // change uploaded file name to original file name plus date at time of upload
    }
})

var upload = multer({ storage: storage });



// DB connection 
const dbURI = dbKey;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

 

// Checks if the user is logged in for each route,
// and if they are gives the ejs files access to a user
// where they can pull and display the user's email (used in the nav)
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('about'); 
});

app.get('/clothing', requireAuth, (req, res) => {
    res.render('clothing');
});

app.get('/upload', requireAuth, (req, res) => {
    res.render('upload');
}); 

// Pulls the image uploaded to the html element 'imageUpload' in the form on upload.ejs
// and saves it to the multer storage space 
app.post('/upload', requireAuth, upload.single('imageUpload'), (req, res) => {
    const file = req.file;
    console.log(file.originalname);
    //res.send(file);
    res.redirect('/upload');
})

app.use(authRoutes);

