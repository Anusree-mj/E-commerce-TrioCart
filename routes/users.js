var express = require('express');
var router = express.Router();

const productHelpers = require('../helpers/user/product-helpers')
const userHelpers = require('../helpers/user/user-helpers');
const userUpdateHelpers = require('../helpers/user/userUpdate-helpers');
const sessionHelpers = require('../helpers/user/session-helpers');
const categoryHelpers = require('../helpers/user/category-helpers');
const cartHelpers = require('../helpers/user/cart-helpers');
const billingAddressHelpers = require('../helpers/user/billingAddress-helpers');
const orderHelpers = require('../helpers/user/orderHelpers');

/* GET  home page. */
router.get('/', async function (req, res, next) {
  let sessionId = req.cookies.session

  let products = await productHelpers.getNewArrivalProducts();
  let allCategories = await categoryHelpers.getCategoryDetails()

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user
      let userId = result.user._id

      cartHelpers.getMyCartProducts(userId).then((result) => {
        if (result) {
          let totalCartProduct = result.totalCount;
          res.render('users/home', { layout: 'layout/layout', products, allCategories, user: user, totalCartProduct });
        }
      })
    } else {
      res.render('users/home', { layout: 'layout/layout', products, allCategories, user: undefined });
    }
  });
})

// get profile page
router.get('/profile', async function (req, res, next) {
  let sessionId = req.cookies.session
  let allCategories = await categoryHelpers.getCategoryDetails()

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user

      let userId = result.user._id
      cartHelpers.getMyCartProducts(userId).then((result) => {
        if (result) {
          let totalCartProduct = result.totalCount;
          res.render('users/profile', { layout: 'layout/layout', allCategories, user: user, totalCartProduct });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  });
})

//update profile
router.put('/profile/:userId', function (req, res, next) {
  let userId = req.params.userId;

  userUpdateHelpers.updateUser(userId, req.body).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

//change password
router.put('/password', function (req, res, next) {

  userUpdateHelpers.changePassword(req.body).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
});

/* get cart. */
router.get('/cart', async function (req, res, next) {
  let allCategories = await categoryHelpers.getCategoryDetails()
  productHelpers.getNewArrivalProducts().then(result => {
    let viewMoreProducts = [...result.category1, ...result.category2, ...result.category3, ...result.category4];

    let sessionId = req.cookies.session
    sessionHelpers.checkSessions(sessionId).then((result) => {
      if (result.status === 'ok') {
        let user = result.user

        cartHelpers.getMyCartProducts(user).then((result) => {
          if (result) {
            let cartProducts = result.cartProducts;
            let totalprice = result.totalprice;
            let totalCartProduct = result.totalCount;


            res.render('users/cart', {
              layout: 'layout/layout', allCategories, viewMoreProducts, user, cartProducts, totalprice,
              totalCartProduct
            });
          } else {
            res.render('users/cart', {
              layout: 'layout/layout', allCategories, viewMoreProducts, user,
              cartProducts: undefined, totalCartProduct: undefined, totalPrice: undefined
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

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user

      cartHelpers.addToCart(user, productId, size).then(() => {
        res.status(200).json({ status: "ok" });
      })
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//remove from cart
router.put('/cart/:product_id', function (req, res, next) {
  let productId = req.params.product_id
  let body = req.body

  cartHelpers.removeCartProducts(productId, body).then(result => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//productcount increase 
router.put('/:product_id/add', function (req, res, next) {
  let productId = req.params.product_id
  let size = req.body.size
  cartHelpers.cartProductIncrement(productId, size).then(result => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

//productcount decrease 
router.put('/:product_id/cancel', function (req, res, next) {
  let productId = req.params.product_id
  let size = req.body.size
  cartHelpers.cartProductDecremnt(productId, size).then(result => {
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
  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user;

      cartHelpers.getMyCartProducts(user).then((result) => {
        if (result.cartProducts) {
          let cartProducts = result.cartProducts;
          let totalprice = result.totalprice;
          let totalCartProduct = result.totalCount;

          res.render('users/checkout', {
            layout: 'layout/layout', user, cartProducts
            , totalCartProduct, totalprice
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
  billingAddressHelpers.saveBillingAddress(user).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

// getbilling address for editing
router.get('/billingAddress/:adressId', function (req, res, next) {
  let addressId = req.params.adressId;
  let sessionId = req.cookies.session

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      billingAddressHelpers.getBillingAddress(addressId).then(result => {
        if (result.address) {
          let address = result.address

          res.status(200).json({ status: "ok", address });
        } else {
          res.status(400).json({ status: "nok" });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

// delete billing address 
router.delete('/billingAddress/:adressId', function (req, res, next) {
  let addressId = req.params.adressId;
  let sessionId = req.cookies.session
  console.log('addressid', addressId)

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let userId = result.user._id

      billingAddressHelpers.deleteBillingAddress(addressId, userId).then(result => {
        if (result.status === 'ok') {
          res.status(200).json({ status: "ok" });
        } else {
          res.status(400).json({ status: "nok" });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

//save user choosed order address
router.put('/orderAddress/:userId', function (req, res, next) {
  let userId = req.params.userId;
  let sessionId = req.cookies.session

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {

      orderHelpers.saveOrderAddress(userId, req.body).then(result => {
        if (result.status === 'ok') {
          res.status(200).json({ status: "ok" });
        } else {
          res.status(400).json({ status: "nok" });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

// update billing address 
router.put('/billingAddress', function (req, res, next) {
  let billingAddress = req.body;

  let sessionId = req.cookies.session
  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      billingAddressHelpers.updateBillingAddress(billingAddress).then(result => {
        if (result.status === 'ok') {
          res.status(200).json({ status: "ok" });
        } else {
          res.status(400).json({ status: "nok" });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})


// post order detais
router.post('/checkout', function (req, res, next) {
  let orderDetails = req.body
  orderHelpers.saveOrderDetails(orderDetails).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})

// order success page
router.get('/order/success', async function (req, res, next) {
  let sessionId = req.cookies.session
  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let userId = result.user._id;
      let userName = result.user.name

      orderHelpers.getAllOrderDetails(userId).then((result) => {
        if (result.status === 'ok') {
          let estimatedTym = result.estimatedDelivery;
          let latestOrder = result.latestOrder

          res.render('users/orderSuccess', { layout: 'layout/layout', estimatedTym, userName, latestOrder });
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

// get order history
router.get('/order/history', async function (req, res, next) {
  let sessionId = req.cookies.session
  let allCategories = await categoryHelpers.getCategoryDetails()
  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user
      let userId = result.user._id;

      cartHelpers.getMyCartProducts(userId).then((result) => {
        if (result) {
          let totalCartProduct = result.totalCount;

          orderHelpers.getAllOrderDetails(userId).then((result) => {
            if (result.status === 'ok') {
              let orderDetails = result.orderDetails

              productHelpers.getNewArrivalProducts().then(result => {
                let viewMoreProducts = [
                  ...result.category1, ...result.category2, ...result.category3, ...result.category4];
                res.render('users/orderHistory', { layout: 'layout/layout', user, allCategories, totalCartProduct, orderDetails, viewMoreProducts });
              })
            }
          })
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

// order details page
router.get('/order/details/:orderId', async function (req, res, next) {
  let orderId = req.params.orderId;
  let sessionId = req.cookies.session
  let allCategories = await categoryHelpers.getCategoryDetails()

  sessionHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      let user = result.user
      let userId = result.user._id;

      cartHelpers.getMyCartProducts(userId).then((result) => {
        if (result) {
          let totalCartProduct = result.totalCount;

          orderHelpers.getAnOrder(orderId).then((result) => {
            let order = result.order

            productHelpers.getNewArrivalProducts().then(result => {
              let viewMoreProducts = [
                ...result.category1, ...result.category2, ...result.category3, ...result.category4];
              res.render('users/orderDetails', { layout: 'layout/layout', user, allCategories, totalCartProduct, order, viewMoreProducts });
            })
          })
        }
      })
    } else {
      res.redirect('/user/login')
    }
  })
})

//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.session
  sessionHelpers.deleteSessions(sessionId).then((result) => {
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
