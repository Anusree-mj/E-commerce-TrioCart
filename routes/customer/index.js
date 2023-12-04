var express = require('express');
var router = express.Router();
const controller = require("../../controllers")

const productHelpers = require('../../helpers/user/product-helpers')
const userHelpers = require('../../helpers/user/user-helpers');
const userUpdateHelpers = require('../../helpers/user/userUpdate-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');
const billingAddressHelpers = require('../../helpers/user/billingAddress-helpers');
const orderHelpers = require('../../helpers/user/orderHelpers');

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
router.get('/profile', controller.customerControllers.profileController.getProfilePage)

//update profile
router.put('/profile/:userId',controller.customerControllers.profileController.updateProfile );

//change password
router.put('/password', controller.customerControllers.profileController.changePassword);

/* get cart. */
router.get('/cart', controller.customerControllers.cartController.getCartPage);

//add to cart
router.post('/cart/:product_id', controller.customerControllers.cartController.addProductToCart)

//remove from cart
router.put('/cart/:product_id', controller.customerControllers.cartController.removeProductFromCart)

//productcount increase 
router.put('/:product_id/add', controller.customerControllers.cartController.addProductCount)

//productcount decrease 
router.put('/:product_id/cancel', controller.customerControllers.cartController.decreaseProductCount)

//get checkout page
router.get('/checkout', controller.customerControllers.checkoutController.getCheckoutPage)

// save billing address to userCollection
router.post('/checkout/user', controller.customerControllers.billingAddressController.saveBillingAddress)

// getbilling address for editing
router.get('/billingAddress/:adressId',controller.customerControllers.billingAddressController.getEditBillingAddressDiv)

// delete billing address 
router.delete('/billingAddress/:adressId', controller.customerControllers.billingAddressController.deletBillingAddress)

//save user choosed order address
router.put('/orderAddress/:userId', controller.customerControllers.checkoutController.saveOrderAddress)

// update billing address 
router.put('/billingAddress', controller.customerControllers.billingAddressController.updateBillingAddress)


// post checkout detais
router.post('/checkout', controller.customerControllers.checkoutController.submitCheckoutPageDetails)

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
