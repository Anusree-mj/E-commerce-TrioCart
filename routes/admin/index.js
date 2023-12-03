var express = require('express');
const { route } = require('../customer/users');
var router = express.Router();
var path = require('path');
const controller = require("../../controllers")

const productHelpers = require('../../helpers/user/product-helpers')
const adminOrderHelpers = require('../../helpers/admin/orders/adminOrder-helpers');
const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminUserHelpers = require('../../helpers/admin/manageUser/adminUser-helpers');
const adminImgStockHelpers = require('../../helpers/admin/products/adminImgStock-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const adminProductHelpers = require('../../helpers/admin/products/adminProduct-helpers');
const adminCategoryHelpers = require('../../helpers/admin/products/adminCategory-hepers');


const uuidv4 = require('uuid').v4

//admin page
router.get('/', controller.adminControllers.dashboardController.getDashboardPage);

//get adminlogin page
router.get('/login', controller.adminControllers.loginController.getLoginPage);

//admin loging in
router.post('/adminLogin', controller.adminControllers.loginController.sendAdminLoginRequest)

//get products list
router.get('/products', controller.adminControllers.productManagementController.getProductPage);

//add product page
router.get('/addProduct', controller.adminControllers.productManagementController.getAddProductPage)

//add products
router.post('/product', controller.adminControllers.productManagementController.addProduct)

//delte product main image
router.delete('/products/mainImage', controller.adminControllers.productManagementController.softDeleteProductMainImage)

//delte product detailed image
router.delete('/products/image', controller.adminControllers.productManagementController.softDeleteProductDetailedImage)

//delete products
router.delete('/products/dlt/:product_Id', controller.adminControllers.productManagementController.softDeleteProduct)

//undo product delete
router.put('/products/dlt/:product_id', controller.adminControllers.productManagementController.undoSoftDeleteProduct)

//get edit product page
router.get('/products/:product_Id', controller.adminControllers.productManagementController.getEditProductPage)

//edit products
router.put('/products/:product_Id', controller.adminControllers.productManagementController.editProduct)

//get edit stockproduct  page
router.get('/products/:product_Id/stock', controller.adminControllers.productManagementController.getEditProductStockPage)

//edit products stock
router.put('/products/:product_Id/stock', controller.adminControllers.productManagementController.editProductStock)

//get category page
router.get('/category', controller.adminControllers.categoryManagementController.getCategoryPage)

//add category page
router.get('/addCategory', controller.adminControllers.categoryManagementController.getAddCategoryPage)

//delete subcategory
router.patch('/category', controller.adminControllers.categoryManagementController.softDeleteSubcategory)

//undo subcategory delete
router.patch('/subcategory/undo', controller.adminControllers.categoryManagementController.undoSoftDeleteSubcategory)

//add subcategory
router.post('/category', controller.adminControllers.categoryManagementController.addSubcategory)

//get users list
router.get('/users', controller.adminControllers.userManagementController.getUserPage);

//block users
router.delete('/users', controller.adminControllers.userManagementController.softDeleteUser)

//unblock users
router.put('/users', controller.adminControllers.userManagementController.undoSoftDeleteUser)

//get orders list
router.get('/orders', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminLoginHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {

      adminOrderHelpers.getAllOrders().then((results) => {
        let orders = results.orders

        res.render('admin/adminOrders', { layout: 'layout/layout', orders });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
});

//edit order status
router.put('/orders', function (req, res) {
  let data = req.body
  console.log("ssssssssss", data)

  adminOrderHelpers.updateOrderStatus(data).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

// order details page
router.get('/order/:orderId', async function (req, res, next) {
  let orderId = req.params.orderId;
  let sessionId = req.cookies.adminSession

  adminLoginHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      adminOrderHelpers.getAnOrder(orderId).then((result) => {
        let order = result.order

        res.render('admin/adminOrderDetails', { layout: 'layout/layout', order });
      })
    } else {
      res.redirect('/admin/login')
    }
  })
})




//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminLoginHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.redirect('/admin');
      })
    }
  })
})
module.exports = router;
