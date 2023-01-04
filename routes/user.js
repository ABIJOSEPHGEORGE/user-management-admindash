var express = require('express');
var router = express.Router();
var session;

/* GET users listing. */
router.get('/home', function(req, res) {
  session = req.session;
  if(session.userid){
    res.render('home')
  }else{
    return res.redirect('/')
  }
});


//logout user
router.get('/logout',(req,res)=>{
  req.session.destroy();
  return res.redirect('/');
})

module.exports = router;
