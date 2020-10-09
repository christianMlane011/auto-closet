const express = require('express');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();


// view engine
app.set('view engine', 'ejs');
 
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());



// DB connection 
const dbURI = `CUT FOR PRIVACY`;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));



app.get('/', (req, res) => {
    res.render('about'); 
});

app.get('/clothing', (req, res) => {
    res.render('clothing');
});

app.use(authRoutes);

app.get('/set-cookies', (req, res) => {
    
    // res.setHeader('Set-Cookie', 'newUser=true');

    res.cookie('newUser', false);
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

    res.send('you got the cookies!');

});

app.get('/read-cookies', (req, res) => {

    const cookies = req.cookies;
    console.log(cookies.newUser);

    res.json(cookies);

});