const express = require('express');
const router = express.Router();
const controller = require("../../controllers")


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
router.get('/orders', controller.adminControllers.orderManagementController.getOrderPage);

//edit order status
router.put('/orders', controller.adminControllers.orderManagementController.editOrderStatus)

// order details page
router.get('/order/:orderId', controller.adminControllers.orderManagementController.getOrderDetailPage )

//logout
router.get('/logout', controller.adminControllers.loginController.logout)
module.exports = router;
