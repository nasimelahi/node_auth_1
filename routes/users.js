const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//model
const User = require('../model/User')
// Login page
router.get('/login',(req,res) => res.render('login'));

//Register Page
router.get('/register', (req,res) =>  res.render('register'));

router.post('/register',(req,res) => {
    const { name, email, password} = req.body;

    let errors = [];

    if(!name || !email || !password){
        errors.push[{msg: "please fill all the field"}]
    }

    
    if(password.lenght<6){
        errors.push[{msg:'password should be at least 6 chara'}]
    }

    if(errors.lenght>0){
        res.render('register',{
            errors,
            name,
            email,
            password
           
        })
    }else{
        User.findOne({email : email})
        .then(user => {
            if(user){
                //user exite
                errors.push({ msg : "email is alrady register"});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password
                   
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                bcrypt.genSalt(10, (err,salt) => 
                    bcrypt.hash(newUser.password, salt , (err, hash) => {
                        if(err) throw err;
                        //set password to hash
                        newUser.password = hash;
                        // save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','you are now register you can loged in')
                            res.redirect('/users/login')
                        })
                        .catch((err) => console.log(err))
                }))
            }
        })
    }
});
//Login Handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash : true

    })(req,res,next);
});

module.exports = router;