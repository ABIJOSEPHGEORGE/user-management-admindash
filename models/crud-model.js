var {User} = require('../models/user');

//find user
function findUser(req,res,user,filter,errorMsg,successMsg){
    user.findOne(filter).lean()
    .then((data)=>{
      res.render('update-form',{admin:true,data:data,err:errorMsg,success:successMsg})
    }) 
}

//Update User username
function updateUserName(req,res,currentValue,changeValue){
    User.updateOne({_id:{$eq:currentValue}},{username:changeValue},(err,docs)=>{
      if(err){
        console.log("Something went wrong")
      }
    });
    return true;
  }


  //update user email
function updateEmail(req,res,currentValue,changeValue){
    User.updateOne({_id:{$eq:currentValue}},{email:changeValue},(err,docs)=>{
      if(err){
        console.log("Something went wrong")
      }
    });
    return true;
  }

//delete user
function deleteUser(id){
    User.deleteOne({_id:{$eq:id}},(err,docs)=>{
      if(err){
        console.log(err);
      }
    })
    return true;
  }


module.exports = {
    findUser : findUser,
    updateUserName : updateUserName,
    updateEmail : updateEmail,
    deleteUser : deleteUser,
}