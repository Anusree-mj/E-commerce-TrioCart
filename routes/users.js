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

//get all products of ladies
router.get('/view/ladies',function(req,res,next){
  productHelpers.viewAllLadiesProducts().then((products)=>{
    res.render('users/ladies',{ layout: 'layout/layout',products})
  })
})

//get all products of mens
router.get('/view/mens',function(req,res,next){
  productHelpers.viewAllMensProducts().then((products)=>{
    res.render('users/mens',{ layout: 'layout/layout',products})
  })
})

//get all products of girls
router.get('/view/girls',function(req,res,next){
  productHelpers.viewAllGirlsProducts().then((products)=>{
    res.render('users/girls',{ layout: 'layout/layout',products})
  })
})

//get all products of boys
router.get('/view/boys',function(req,res,next){
  productHelpers.viewAllBoysProducts().then((products)=>{
    res.render('users/boys',{ layout: 'layout/layout',products})
  })
})

//search each subcategory products
router.post('/products',function(req,res,next){
  const category= req.body.category;
  const subcategory=req.body.subCategory
 productHelpers.viewEachSubcategoryProducts(category,subcategory).then((products)=>{
    console.log(products)
  if(products){
    res.status(200).json({ status: "ok", category,subcategory });
  }else{
    res.status(500).json({ status: "nok" });
  }
 })
 })

//get each subcategory products
router.get('/products/:category/:subcategory',function(req,res,next){
   const category=req.params.category
   const subCategory=req.params.subcategory
   productHelpers.viewEachSubcategoryProducts(category,subCategory).then((products)=>{
   res.render('users/products',{ layout: 'layout/layout',products})
   })
})

//logout
router.get('/logout',function(req,res,next){
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid');
    res.redirect('/');
})
})

module.exports = router;
