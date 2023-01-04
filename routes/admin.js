var express = require("express");
var router = express.Router();
var {User,hashingAndInsertion} = require('../models/user');
var {adminFormValidation,isExistAdmin} = require('../middleware/auth');
var {updateUserName,updateEmail,deleteUser} = require('../models/crud-model');
var {sessionHandling,sessionAndFind,checkUserName,checkUserEmail,searchUser} = require('../helpers/admin-helpers');

var errorMsg = "";
var session;
var filter;
const adminUsername = "Admin";
const adminPassword = 987654;


/*Get the admin login */
router.get("/",(req, res) =>{
  session = req.session;
  if(session.userid){
    return res.redirect('/users/home');
  }else{
    return sessionHandling(req,res,session,'admindashboard')
  }
  
});


/*admin signin */
router.post("/signin", (req, res) => {
  if (
    req.body.username != adminUsername ||
    req.body.password != adminPassword
  ) {
    errorMsg = "Incorrect username or password, try again...";
    return res.render("adminlogin", { layout: false, err: errorMsg });
  }
  session = req.session;
  session.admin = req.body.username;
  sessionHandling(req,res,session,'admindashboard')
  
});

router.get('/signin',(req,res)=>{
  session = req.session;
  if(session.admin){
    res.redirect('/admin/dashboard');
  }else{
    res.redirect('/admin');
  }
})

/*admin dashboard */
router.get('/dashboard',(req,res)=>{
  session = req.session;
  sessionHandling(req,res,session,'admindashboard');
})

/*get add user page */
router.get("/add-user", (req, res) => {
  
  session = req.session;
  sessionHandling(req,res,session,'add-user');
});

router.post('/add-user',adminFormValidation('add-user'),isExistAdmin('add-user'),(req,res)=>{
  let user = new User({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
  })
  
  hashingAndInsertion(user);
  const message = 'User added successfully';
  return res.render('add-user',{admin:true,success:message})
})

/*admin logout*/
router.get('/logout',(req,res)=>{
  req.session.destroy();
  return res.redirect('/admin');
})

/*get update user page */
router.get('/update-user',(req,res)=>{
  session = req.session;
  sessionHandling(req,res,session,'update-user');
})

/*get Update user form */
router.get('/update-form',(req,res)=>{
  const id = req.query.id;
  filter = {_id:id}
  session = req.session;
  sessionAndFind(req,res,session,filter);
})

/*Update user data*/
router.post('/update-user',(req,res)=>{
      session = req.session;
      User.findOne(filter).lean().
      then((data)=>{
        let username = data.username;
        let email = data.email;
        let id = data._id;
        let inputUsername = req.body.username;
        let inputEmail = req.body.email;
        if(username == inputUsername && email == inputEmail){
          errorMsg = 'No change identified...'
          return sessionAndFind(req,res,session,filter,errorMsg);
        }
        if(inputUsername!=username){
          checkUserName(inputUsername)
          .then((msg)=>{
            updateUserName(req,res,id,inputUsername)
            return sessionHandling(req,res,session,'update-user',msg);
          }).catch((err)=>{
            return sessionAndFind(req,res,session,filter,err);
          })
        }
        if(inputEmail!=email){
          checkUserEmail(inputEmail)
          .then((msg)=>{
            updateEmail(req,res,id,inputEmail)
            return sessionHandling(req,res,session,'update-user',msg);
          }).catch((err)=>{
            return sessionAndFind(req,res,session,filter,err);
          })
        }
      })    
})


/*get delete user page*/
router.get('/delete-page',(req,res)=>{
  session = req.session;
  sessionHandling(req,res,session,'delete-user');
})

/*Delete user action*/
router.get('/delete-user/',(req,res)=>{
  const id = req.query.id;
  let deleted = deleteUser(id);
  if(deleted){
    session = req.session;
    res.redirect('/admin/delete-page');
  }
})

router.get('/search',async (req,res)=>{
  searchUser(req,res);
  
})

module.exports = router;
