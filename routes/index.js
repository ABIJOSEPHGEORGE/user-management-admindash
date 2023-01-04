var express = require('express');
var router = express.Router();
var {User,hashingAndInsertion} = require('../models/user');
var {validation,isExist,authentication} = require('../middleware/auth');
var {sessionHandling,signUpSession} = require('../helpers/index-helpers');
var session;

/*Get the login page */
router.get('/',(req,res)=>{
  session = req.session;
  if(session.admin){
    res.render('home',{adminrole:true});
  }else{
    sessionHandling(req,res,session,'/users/home')
  }
  
})

/*Get the SignUp Page*/
router.get('/signup',(req,res)=>{
  session = req.session;
  signUpSession(req,res,session,'signup');
})

/*User signup */
router.post('/signup',validation,isExist,async(req,res)=>{
  session = req.session;
  session.userid = req.body.username;
  let user = new User({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
  })
  hashingAndInsertion(user)
  
  sessionHandling(req,res,session,'/users/home')
})

router.get('/signup',(req,res)=>{
  session = req.session;
  if(session.userid){
    res.redirect('/users/home');
  }else{
    res.redirect('/')
  }
})

/*User signin */
router.post('/signin',authentication,(req,res)=>{
  session = req.session;
  session.userid = req.body.username;
  sessionHandling(req,res,session,'/users/home')
})

router.get('/signin',(req,res)=>{
  session = req.session;
  if(session.userid){
    res.redirect('/users/home');
  }else{
    res.redirect('/');
  }
})

module.exports = router;