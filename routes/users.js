var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');

/* GET  home page. */
router.get('/', async function (req, res, next) {
  let sessionId = req.cookies.session
  let products = await productHelpers.getNewArrivalProducts();
  let allCategories = await userHelpers.getCategoryDetails()
  
  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user
      res.render('users/home', { layout: 'layout/layout', products, allCategories, user: user });

    } else {
      res.render('users/home', { layout: 'layout/layout', products, allCategories, user: undefined });
    }
  });
})

/* get cart. */
router.get('/cart', async function (req, res, next) {
  let allCategories = await userHelpers.getCategoryDetails()
  productHelpers.getNewArrivalProducts().then(result => {
    let viewMoreProducts = [...result.category1, ...result.category2, ...result.category3, ...result.category4];

    let sessionId = req.cookies.session
    userHelpers.checkSessions(sessionId).then((result) => {
      if (result.status === 'ok') {
        let user = result.user

        userHelpers.getMyCartProducts(user).then((result) => {
          if (result.cartProducts) {
            let cartProducts = result.cartProducts;
            console.log(cartProducts, 'cart products')
            res.render('users/cart', {
              layout: 'layout/layout', allCategories, viewMoreProducts, user, cartProducts
            });
          } else {
            res.render('users/cart', {
              layout: 'layout/layout', allCategories, viewMoreProducts, user,cartProducts:undefined
            });
          }
        })
      } else {
        res.redirect('/user/login')
      }
    });
  })
})

//add to cart
router.get('/addtoCart/:product_id', async function (req, res, next) {
  let productId = req.params.product_id
  let sessionId = req.cookies.session

  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user
      console.log(user, 'user in addto cart')
      userHelpers.addToCart(user, productId).then(() => {
        res.redirect('back');
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

//remove from cart
router.put('/cart/:product_id', function (req, res, next) {
  let productId = req.params.product_id
  let userId = req.body.userId
  userHelpers.removeCartProducts(productId, userId).then(result => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//get checkout page
router.get('/checkout', function (req, res, next) {
  let sessionId = req.cookies.session
  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user;
      res.render('users/cart', {
        layout: 'layout/layout',user });
    }else{
      res.redirect('/user/login')
    }
  })
})

//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.session
  userHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.isAuthenticated = false;
      req.session.destroy(function (err) {
        res.clearCookie('session');
        res.redirect('/');
      })
    }
  })

})

module.exports = router;
