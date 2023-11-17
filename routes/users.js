var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');
const uuidv4 = require('uuid').v4
const signupUtil = require('../utils/signupUtil');

/* GET  home page. */
router.get('/', async function (req, res, next) {
  let sessionId = req.cookies.session
  let products = await productHelpers.getNewArrivalProducts();
  let allCategories = await userHelpers.getCategoryDetails()
  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      userHelpers.getUser(result.email).then((user) => {
        console.log("userrrrrr innnnnn homeeeeeeeee:", user)
        res.render('users/home', { layout: 'layout/layout', products, allCategories, user: user });
      })
    } else {
      res.render('users/home', { layout: 'layout/layout', products, allCategories, user: undefined });
    }
  });
})

//get login page
router.get('/login', function (req, res, next) {
  res.render('users/logins/login', { layout: 'layout/layout' });
});

//loging in
router.post('/login', function (req, res, next) {
  userHelpers.dologin(req.body).then((result) => {
    if (result) {
      const sessionId = uuidv4();
      const userId = result.email
      userHelpers.saveSessions(sessionId, userId)
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    } else if (result.status === 'invalid') {
      res.status(400).json({ status: "invalid" });
    } else {
      res.status(400).json({ status: "blocked" });
    }
  })
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
router.patch('/forgotPassword', (req, res, nxt) => {
  let email = req.body.email
  let password = req.body.password
  userHelpers.updatePassword(email, password).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

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


// get all category products
router.get('/products/:category/viewAll', async function (req, res, next) {
  const category = req.params.category
  let allCategories = await userHelpers.getCategoryDetails()
  productHelpers.viewAllProductsofEAchCAtegory(category).then((result) => {
    let products = result.products;
    let categories = result.categories;
    let sessionId = req.cookies.session
    userHelpers.checkSessions(sessionId).then((result) => {
      if (result.status === 'ok') {
        userHelpers.getUser(result.email).then((user) => {
          res.render('users/categoryProducts', { layout: 'layout/layout', allCategories, products, categories, user })
        })
      } else {
        res.render('users/categoryProducts', { layout: 'layout/layout', allCategories, products, categories, user: undefined })
      }
    })
  })
})

//get each subcategory products
router.get('/products/:category/:subcategory', async function (req, res, next) {
  const category = req.params.category
  const subCategory = req.params.subcategory
  let allCategories = await userHelpers.getCategoryDetails()
  productHelpers.viewEachSubcategoryProducts(category, subCategory).then((result) => {
    let categories = result.categories;
    let products = result.products;
    let sessionId = req.cookies.session
    userHelpers.checkSessions(sessionId).then((result) => {
      if (result.status === 'ok') {
        userHelpers.getUser(result.email).then((user) => {
          res.render('users/subCategoryProducts', { layout: 'layout/layout', allCategories, categories, products, user })

        })
      } else {
        res.render('users/subCategoryProducts', { layout: 'layout/layout', allCategories, categories, products, user: undefined })

      }
    })
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
        res.clearCookie('session');
        res.redirect('/');
      })
    }
  })

})

module.exports = router;
