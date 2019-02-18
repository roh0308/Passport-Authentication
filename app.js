const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const passport = require('passport');
const flash=require('connect-flash');
const session=require('express-session');


const app=express();

require('./config/passport')(passport);

//DB config
const db=require('./config/keys').mongoURI;


//mogodb connect
mongoose.connect(db,{useNewUrlParser:true})
    .then(() =>console.log('MongoDB connected...'))
    .catch(err =>console.log(err));

//EJS(middleware)
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
 app.use(express.urlencoded({extended:false}));


 //express session
app.use(session({
 secret:'secret',
 resave:true,
 saveUninitialized:true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect flash
app.use(flash());

//Global vars
app.use((req,res,next)=>{
 res.locals.success_msg =req.flash('success_msg');
 res.locals.error_msg =req.flash('error_msg');
 res.locals.error =req.flash('error');
 next();
});

//Routes
app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/users.js'));



const PORT=process.env.PORT ||8000;
app.listen(PORT,console.log('Server started on port '));