const express = require('express');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { dbKey } = require("./config");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const multer = require("multer");


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
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'userUploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname + '-' + Date.now())
    }
});

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

app.post('/upload', requireAuth, upload.single('imageUpload'), (req, res) => {
    const file = req.file;
    console.log(req.files);
    //res.send(file);
    res.redirect('/upload');
})

app.use(authRoutes);

