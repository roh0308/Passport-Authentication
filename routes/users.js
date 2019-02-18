const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport=require('passport');
const User=require('./../models/User');
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

//Register handle
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;

    //declare array
    let errors=[];

    //check requird fields
    if(!name || !email || !password ||!password2){
        errors.push({msg: 'please fill in all fields'});
    }

    //check password match
    if(password!==password2){
        errors.push({msg:'password do not match'});
    }

    //check password length
    if(password.length<6){
        errors.push({msg:'password should be at least 6 characters'})
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
    //validation passed
            User.findOne({ email: email })
                .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name ,
                        email,
                        password
                  });
                 bcrypt.genSalt(10,(err,salt)=>
                 bcrypt.hash(newUser.password,salt,(err,hash)=>{
                     if(err) throw err;
                     //set password to hashed
                     newUser.password=hash;
                     //save user
                     newUser.save()
                         .then(user=>{
                             req.flash('success_msg','You are now registered and can login');
                             res.redirect('/users/login');
                         })
                         .catch(err => console.log(err));
                 }))
                }
            });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handle
router.get('/logout',(req,res)=> {
   req.logout();
   req.flash('success_msg','You are logged out');
   res.redirect('/users/login');
});

module.exports=router;