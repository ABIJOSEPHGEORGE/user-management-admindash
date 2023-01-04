var bcrypt = require('bcrypt');
var {User,validate} = require('../models/user')
var errorMsg="";

//validating the request with joi validator
function validation(req,res,next){
    const {error} = validate(req.body);
    if(error){
      // return console.log(error.details[0].message);
      errorMsg = error.details[0].message;
      return res.render('signup',{layout:false,err:errorMsg});
    }
    else{
      next()
    }
  }

  //validation for admin forms
  function adminFormValidation(page){
    return (req,res,next)=>{
      const {error}=validate(req.body);
      if(error){
        errorMsg = error.details[0].message;
        return res.render(page,{admin:true,err:errorMsg})
      }else{
        next()
      }
    }
  }
  
  //checking wheather the user exist
  
  async function isExist(req,res,next){
    let user = await User.findOne({$or:[{username:req.body.username},{email:req.body.email}]})
  if(user){
    // return res.send('Error user exist')
    errorMsg = 'Username or Email Id already exist, Try another...'
    return res.render('signup',{layout:false,err:errorMsg});
  }else{
    next();
  }
  }


  //isExist from admin side

  function isExistAdmin(page){
    return async (req,res,next)=>{
      let user = await User.findOne({$or:[{username:req.body.username},{email:req.body.email}]});
      if(user){
        errorMsg = 'User already exist, try again...'
        return res.render(page,{admin:true,err:errorMsg});
      }else{
        next();
      }
    }
  }

  

//login page authentication
async function authentication(req,res,next){
  let user = await User.findOne({username:req.body.username});
  if(!user){
    errorMsg = 'Incorrect Username, please try again...'
    return res.render('index',{layout:false,err:errorMsg})
  }
  let validPassword = await bcrypt.compare(req.body.password,user.password); 
  if(!validPassword){
    errorMsg = 'Incorrect Password, please try again...'
    return res.render('index',{layout:false,err:errorMsg});
  }
  next()
}



  module.exports ={
    validation:validation,
    isExist : isExist,
    errorMsg : errorMsg,
    authentication:authentication,
    adminFormValidation : adminFormValidation,
    isExistAdmin : isExistAdmin,
  }