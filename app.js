const express = require('express');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { dbKey } = require("./config");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


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



app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('about'); 
});

app.get('/clothing', requireAuth, (req, res) => {
    res.render('clothing');
});

app.use(authRoutes);

