var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers');
const uuidv4 = require('uuid').v4

router.get('/', function(req, res, next) {
  productHelpers.getNewArrivalProducts().then((products)=>{
    res.render('index', { layout: 'layout/layout',products });
   })
});

/* GET users home page. */
router.get('/home', function(req, res, next) {
  if (req.session.isAuthenticated) {
    let user=req.session.user
    console.log(user)
    productHelpers.getNewArrivalProducts().then((products)=>{
      res.render('users/home', { layout: 'layout/layout',products,user });
     })
} else {
    res.redirect('/');
}
});

//get login page
router.get('/login', function(req, res, next) {
    res.render('users/login', { layout: 'layout/layout'}); 
});

//get signup page
router.get('/signup', function(req, res, next) {
    res.render('users/signup', { layout: 'layout/layout'}); 
});

//signing up
router.post('/signup', function(req, res, next) {
  userHelpers.doSignup(req.body).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
});

//loging in
router.post('/login', function(req, res, next) {
  userHelpers.dologin(req.body).then((result)=>{
    if(result){
      const sessionId = uuidv4();
      req.session.isAuthenticated = true;
      req.session.user=result
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    }else{
      res.status(500).json({ status: "nok" });
    }
  })
});

//logout
router.get('/logout',function(req,res,next){
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid');
    res.redirect('/');
})
})

module.exports = router;
