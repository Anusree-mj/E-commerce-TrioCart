const productController = require('./products/products.controller')
const categoryController = require('./products/category.controller')
const subcategoryController = require('./products/subcategory.controller')
const searchController = require('./products/search.controller')
const loginController = require('./userLogins/login.controller')
const signupController = require('./userLogins/signup.controller')
const otpController = require('./userLogins/otp.controller')
const passwordController = require('./user/password.controller')
const profileController = require('./user/profile.controller')
const cartController = require('./c&c/cart.controller')
const checkoutController = require('./c&c/checkout.controller')
const billingAddressController = require('./c&c/billingAddress.controller');
const orderController = require('./orders/order.controller');
const homeController = require('./user/home.controller');
const couponController = require('./user/coupon.controller');


module.exports = {
    productController,
    categoryController,
    subcategoryController,
    searchController,
    loginController,
    signupController,
    otpController,
    passwordController,
    profileController,
    cartController,
    checkoutController,
    billingAddressController,
    orderController,
    homeController,
    couponController
}