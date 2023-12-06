const usersCollection = require("./user-model");
const cartCollection = require("./cart-model");
const orderCollection = require("./order-model");
const productsCollection = require("./product-model");
const categoryCollection = require('./category-model');
const adminCollection = require('./admin-model');
const adminSessionCollection = require('./adminSession-model');
const tempUsersCollection = require('./tempUsers-model');
const sessionCollection = require('./userSession-model');
const paymentCollection = require('./payment-model');

 
module.exports = {
    usersCollection,
    cartCollection,
    orderCollection,
    productsCollection,
    categoryCollection,
    adminCollection,
    adminSessionCollection,
    tempUsersCollection,
    sessionCollection,
    paymentCollection
}