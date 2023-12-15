const imageController = require("./image.controller");
const dashboardController = require("./dashboard.controller");
const loginController = require("./login.controller");
const productManagementController = require("./productManagement.controller");
const categoryManagementController = require("./categoryManagement.controller");
const userManagementController = require("./userManagement.controller");
const orderManagementController = require("./orderManagement.controller");
const returnController = require("./returns.controller");
const salesController = require("./sales.controller");
const stockController = require("./stock.controller");
const categoryOfferController = require("./categoryOfferManagement.controller");


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
    stockController,categoryOfferController
}