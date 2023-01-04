
/*session handling */
function sessionHandling(req,res,sessionCheck,path){
    if(sessionCheck.userid){
      return res.redirect(path);
    }else{
      return res.render('index',{layout:false});
    }
  }
  
function signUpSession(req,res,sessionCheck,path){
    if(sessionCheck.userid){
      return res.redirect('/users/home');
    }else{
      return res.render(path,{layout:false});
    }
  }

  
  module.exports = {
    sessionHandling : sessionHandling,
    signUpSession : signUpSession,
  }