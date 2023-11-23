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
            console.log('result in cart:', result)
            let cartProducts = result.cartProducts;
            let size = result.size
            let count = result.count;

            console.log('cartproducts in cart:', cartProducts)
            res.render('users/cart', {
              layout: 'layout/layout', allCategories, viewMoreProducts, user, cartProducts
              , size, count
            });
          } else {
            res.render('users/cart', {
              layout: 'layout/layout', allCategories, viewMoreProducts, user, cartProducts: undefined, size: undefined, count: undefined
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
router.post('/cart/:product_id', function (req, res, next) {
  let productId = req.params.product_id
  let size = req.body.choosedSize
  let sessionId = req.cookies.session

  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user
      console.log(user, 'user in addto cart')
      userHelpers.addToCart(user, productId, size).then(() => {
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

      userHelpers.getMyCartProducts(user).then((result) => {
        if (result.cartProducts) {
          let cartProducts = result.cartProducts;
          let size = result.size
          let count = result.count;

          res.render('users/checkout', {
            layout: 'layout/layout', user, cartProducts
            , size, count
          })
        }
      });
    } else {
      res.redirect('/user/login')
    }
  })
})

// save billing address to userCollection
router.post('/checkout/user', function (req, res, next) {
  let user = req.body
  userHelpers.saveBillingAddress(user).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

// post order detais
router.post('/checkout', function (req, res, next) {
  let orderDetails = req.body
  userHelpers.saveOrderDetails(orderDetails).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

router.get('/order/success', async function (req, res, next) {
  
      res.render('users/orderSuccess', { layout: 'layout/layout', products, allCategories, user: undefined });
    
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
