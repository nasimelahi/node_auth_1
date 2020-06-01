const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');



//passport config
require('./config/passportconfig')(passport);
// DB config
const db = require('./config/keys').MongoURI;

//connect mongo
mongoose.connect(db,{  useNewUrlParser: true ,  useUnifiedTopology: true})
.then(() => {console.log('mongo db connected')})
.catch((err) => { console.log(err)});

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({ extended:false}));

// Express Session
app.use(session ({
    secret:'secret',
    resave: false,
    saveUninitialized : true,    
}));
//passport  middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})


//Route 
app.use('/',require('./routes/index'));
app.use('/users', require ('./routes/users'));




const PORT = process.env.PORT || 5500;

app.listen(PORT,() => {
    console.log('Server is runing at port ' + PORT);
})