const express = require('express');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { dbKey } = require("./config");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const imageUploadRoutes = require("./routes/imageUploadRoutes");
const { addImages } = require("./middleware/imageDisplayMiddleware");
//const { uploadFile } = require("./fileUpload");
// const aws = require("aws-sdk");



const app = express();


// view engine
app.set('view engine', 'ejs');
 
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


// DB connection 
const dbURI = dbKey;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

 

// Checks if the user is logged in for each route,
// and if they are gives the ejs files access to a user
// where they can pull and display the user's email (used in the nav)
// previously app.get('*', checkUser);
app.use('*', checkUser);

app.get('/', (req, res) => {
    res.render('about'); 
});

app.get('/clothing', requireAuth, addImages, (req, res) => {
    res.render('clothing');
});

// User authorization routing, includes signing up, logging in, and logging out
app.use(authRoutes);

// User image upload routes, requires user to be signed in
app.use(requireAuth, imageUploadRoutes);
