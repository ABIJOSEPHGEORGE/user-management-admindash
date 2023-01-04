var {User} = require('../models/user');
var {findUser} = require('../models/crud-model');
;

//fetching all users data along session handling
function sessionHandling(req,res,sessionCheck,path,msg){
  if(sessionCheck.userid){
    res.redirect('/users/home');
  }
  if(sessionCheck.admin){
      getUsers(req,res,path,User,msg)
  }else{
      return res.render('adminlogin',{layout:false});
  }
  }

//fetching single user data along session handling
function sessionAndFind(req,res,sessionCheck,filter,errorMsg,successMsg){
    if(sessionCheck.admin){
      findUser(req,res,User,filter,errorMsg,successMsg)
    }else{
      return res.render('adminlogin',{layout:false});
    }
  }

  //count total users
  function countUsers(){
    return new Promise((res,rej)=>{
      User.estimatedDocumentCount({}).exec((err,count)=>{
        if(err){
          console.log(err);
        }else{
          res(count);
        }
      })
    })
  }


//get all users documents
function getUsers(req,res,path,user,msg){
    user.find({})
      .then((data)=>{
        const context = {
          userData : data.map(data=>{
            return{
              id : data._id,
              username : data.username,
              email : data.email
            } 
          })
        }
          countUsers().then((count)=>{
            res.render(path,{admin:true,data:context.userData,success:msg,count:count})
          })
      })
  }


  //checking username
function checkUserName(inputUsername){
    return new Promise((res,rej)=>{
      User.findOne({username:inputUsername})
      .then((data)=>{
        if(data){
          rej("Username already exist with another user. Try another...")
        }else{
          res("Updated Successfully, Reload the page to reflect the changes...")
        }
      })
    })
  }

  //check user email
function checkUserEmail(inputEmail){
    return new Promise((res,rej)=>{
      User.findOne({email:inputEmail})
      .then((data)=>{
        if(data){
          rej("Email already exist with another user. Try another...")
        }else{
          res("Updated Successfully, Reload the page to reflect the changes...")
        }
      })
    })
  }

//search users data
async function searchUser(req,res){
  let data = await User.find({
    "$or":[
      {username:{$regex:req.query.key}},
      {email:{$regex:req.query.key}},
    ]
  }).lean()
   countUsers().then((count)=>{
    if(data.length!=0){
      return res.render('admindashboard',{admin:true,searchdata:data,count:count})
    }else{
      const message = 'Sorry No user found... Try again';
      return res.render('admindashboard',{admin:true,msg:message,count:count})
    }
    
   })
}

  module.exports = {
    sessionHandling : sessionHandling,
    sessionAndFind : sessionAndFind,
    checkUserName : checkUserName,
    checkUserEmail : checkUserEmail,
    searchUser : searchUser,
  }