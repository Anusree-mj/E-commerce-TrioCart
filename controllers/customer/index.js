const productController = require('./products.controller')
const categoryController = require('./category.controller')
const subcategoryController = require('./subcategory.controller')
const searchController = require('./search.controller')
const loginController = require('./login.controller')
const signupController = require('./signup.controller')
const otpController = require('./otp.controller')
const passwordController = require('./password.controller')
const profileController = require('./profile.controller')
const cartController = require('./c&c/cart.controller')
const checkoutController = require('./c&c/checkout.controller')
const billingAddressController = require('./c&c/billingAddress.controller');
const orderController = require('./order.controller');
const homeController = require('./home.controller');


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
    homeController
}