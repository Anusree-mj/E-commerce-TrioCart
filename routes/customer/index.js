var express = require('express');
var router = express.Router();
const controller = require("../../controllers")

/* GET  home page. */
router.get('/', controller.customerControllers.homeController.getHomePage)

// get profile page
router.get('/profile', controller.customerControllers.profileController.getProfilePage)

//update profile
router.put('/profile/:userId', controller.customerControllers.profileController.updateProfile);

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
router.get('/billingAddress/:adressId', controller.customerControllers.billingAddressController.getEditBillingAddressDiv)

// delete billing address 
router.delete('/billingAddress/:adressId', controller.customerControllers.billingAddressController.deletBillingAddress)

//save user choosed order address
router.put('/orderAddress/:userId', controller.customerControllers.checkoutController.saveOrderAddress)

// update billing address 
router.put('/billingAddress', controller.customerControllers.billingAddressController.updateBillingAddress)

// post checkout detais
router.post('/checkout', controller.customerControllers.checkoutController.submitCheckoutPageDetails)

// verify payment 
router.post('/verifyPayment', controller.customerControllers.checkoutController.verifyPayment)

// order success page
router.get('/order/success', controller.customerControllers.orderController.getOrderSuccessPage)

// get order history
router.get('/order/history', controller.customerControllers.orderController.getOrderHistoryPage)

// order details page
router.get('/order/details/:orderId', controller.customerControllers.orderController.getOrderDetailPage)

// cancel order 
router.put('/order/:orderId/cancel', controller.customerControllers.orderController.cancelOrder)

// return product 
router.post('/order/:productId/return', controller.customerControllers.orderController.returnProduct)

//logout
router.get('/logout', controller.customerControllers.loginController.logout)

module.exports = router;
