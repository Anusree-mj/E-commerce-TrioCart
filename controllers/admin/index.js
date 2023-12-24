const imageController = require("./products/image.controller");
const dashboardController = require("./dashboard/dashboard.controller");
const loginController = require("./logins/login.controller");
const productManagementController = require("./products/productManagement.controller");
const categoryManagementController = require("./products/categoryManagement.controller");
const userManagementController = require("./users/userManagement.controller");
const orderManagementController = require("./orders/orderManagement.controller");
const returnController = require("./orders/returns.controller");
const salesController = require("./sales/sales.controller");
const stockController = require("./products/stock.controller");
const categoryOfferController = require("./offers/categoryOfferManagement.controller");
const productOfferController = require("./offers/productOffer.controllers");
const couponController = require("./users/couponManagement.controllers");
const cashBackController = require("./users/cashBackController");


module.exports = {
    imageController,
    dashboardController,
    loginController,
    productManagementController,
    categoryManagementController,
    userManagementController,
    orderManagementController,
    returnController,
    salesController,
    stockController,categoryOfferController,
    productOfferController,
    couponController,
    cashBackController
}