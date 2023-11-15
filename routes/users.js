var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');
const uuidv4 = require('uuid').v4
const signupUtil = require('../utils/signupUtil');

//get index page
router.get('/index', function (req, res, next) {
  productHelpers.getNewArrivalProducts().then((products) => {
    res.render('index', { layout: 'layout/layout', products });
  })
});

/* GET users home page. */
router.get('/', function (req, res, next) {
  let sessionId = req.cookies.session
  console.log("sessionId of user",sessionId)
  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      console.log("userid in get homeeeeeeee", result.userId)
      userHelpers.getUser(result.userId).then((user) => {
        productHelpers.getNewArrivalProducts().then((products) => {
          res.render('users/home', { layout: 'layout/layout', products, user });
        })
      })
    }
    else {
      res.redirect('/index');
    }
  });
})

//get login page
router.get('/login', function (req, res, next) {
  res.render('users/logins/login', { layout: 'layout/layout' });
});

//get signup page
router.get('/signup', function (req, res, next) {
  res.render('users/logins/signup', { layout: 'layout/layout' });
});

//signup
router.post('/signup', function (req, res, next) {
  const otp = signupUtil.generateOTP();
  userHelpers.doSignup(req.body, otp).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

//get otp verification page
router.get('/userVerify', function (req, res, next) {
  res.render('users/logins/userVerify', { layout: 'layout/layout' });
});

//verify user
router.post('/userVerify', function (req, res, next) {
  userHelpers.doVerifyUser(req.body).then((user) => {
    if (user) {
      const sessionId = uuidv4();
      const userId = user.email
      userHelpers.saveSessions(sessionId, userId)
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

//forgot password
router.get('/forgotPassword', (req, res, nxt) => {
  res.render('users/logins/changePassword', { layout: 'layout/layout' });
})

//forgot password checking for email
router.post('/getOtp', (req, res, next) => {
  let email = req.body.email;
  const otp = signupUtil.generateOTP();
  userHelpers.getOtp(email, otp).then(result => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//CHANGE PASSWORD
router.patch('/forgotPassword', (req, res, nxt) =>{
  let email=req.body.email
  let password =req.body.password
  userHelpers.updatePassword(email,password).then((result)=>{
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
} )

//verify otp for changing password
router.post('/verifyOtp', function (req, res, next) {
  let email = req.body.email;
  let otp = req.body.otp
  userHelpers.verifyOtp(email, otp).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

//loging in
router.post('/login', function (req, res, next) {
  userHelpers.dologin(req.body).then((user) => {
    if (user) {
      const sessionId = uuidv4();
      const userId = user.email
      userHelpers.saveSessions(sessionId, userId)
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

// get all category products
router.get('/products/:category/viewAll', function (req, res, next) {
  const category = req.params.category
  productHelpers.viewAllProductsofEAchCAtegory(category).then((categoryProducts) => {
    console.log('categoryprodcts in category page :', categoryProducts)
    res.render('users/categoryProducts', { layout: 'layout/layout', categoryProducts })
  })
})

//get each subcategory products
router.get('/products/:category/:subcategory', function (req, res, next) {
  const category = req.params.category
  const subCategory = req.params.subcategory
  productHelpers.viewEachSubcategoryProducts(category, subCategory).then((result) => {
    let categoryProducts = result.sideBarProduct
    console.log('categoryprodcts in subcategory page :', categoryProducts)
    let products = result.products
    res.render('users/subCategoryProducts', { layout: 'layout/layout', categoryProducts, products })
  })
})

//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.session
  userHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.isAuthenticated = false;
      req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.redirect('/');
      })
    }
  })

})

module.exports = router;
