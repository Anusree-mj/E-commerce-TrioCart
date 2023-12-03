const usersCollection = require("./user");
const cartCollection = require("./cart");
const orderCollection = require("./order");
const productsCollection = require("./product");
const categoryCollection = require('./category');
const adminCollection = require('./admin');
const adminSessionCollection = require('./adminSession');
const tempUsersCollection = require('./tempUsers');
const sessionCollection = require('./userSession');
 
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
}