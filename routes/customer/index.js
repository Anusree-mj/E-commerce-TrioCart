var express = require('express');
var router = express.Router();
const controller = require("../../controllers")

/* GET  home page. */
router.get('/', controller.customerControllers.homeController.getHomePage)

// get profile page
router.get('/profile', controller.customerControllers.profileController.getProfilePage)

//update profile
router.put('/profile/:userId', controller.customerControllers.profileController.sendUserProfileUpdateRequest);

// resend otp
router.put('/resendOTP', controller.customerControllers.profileController.resendOtp)

//update profile
router.put('/profile/:userId/update', controller.customerControllers.profileController.updateProfile);

//change password
router.put('/password', controller.customerControllers.profileController.changePassword);

// get coupon page
router.get('/coupon', controller.customerControllers.couponController.getCouponPage)

// add a coupon 
router.post('/coupon', controller.customerControllers.couponController.addCoupon)

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

//logout
router.get('/logout', controller.customerControllers.loginController.logout)

module.exports = router;
