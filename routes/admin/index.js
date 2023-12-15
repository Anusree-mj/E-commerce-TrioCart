const express = require('express');
const router = express.Router();
const controller = require("../../controllers")

//admin page
router.get('/', controller.adminControllers.dashboardController.getDashboardPage);

//dashboard graph page
router.get('/dashboard', controller.adminControllers.dashboardController.getOrderGraph);

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

//get adminStock  page
router.get('/stock', controller.adminControllers.stockController.getStockPage)

//get edit stock page
router.get('/stock/:productId/:size', controller.adminControllers.stockController.getEditProductStockPage)

//edit stock
router.put('/stock/:product_Id', controller.adminControllers.stockController.editProductStock)

//get category page
router.get('/category', controller.adminControllers.categoryManagementController.getCategoryPage)

//add category page
router.get('/addCategory', controller.adminControllers.categoryManagementController.getAddCategoryPage)

//get edit category  page
router.get('/:category/:subcategory', controller.adminControllers.categoryManagementController.getEditCategoryPage)

//edit subcategory
// router.put('/category/edit', controller.adminControllers.categoryManagementController.editSubcategory)

//delete subcategory
router.patch('/category', controller.adminControllers.categoryManagementController.softDeleteSubcategory)

//undo subcategory delete
router.patch('/subcategory/undo', controller.adminControllers.categoryManagementController.undoSoftDeleteSubcategory)

//get category offer  page
router.get('/category/offer/:category/:subcategory', controller.adminControllers.categoryOfferController.getCategoryOfferPage)

//edit category offer 
router.put('/category/offer/:category/:subcategory', controller.adminControllers.categoryOfferController.editCategoryOffer)


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
router.get('/order/:orderId/orderDetails', controller.adminControllers.orderManagementController.getOrderDetailPage )

// returns page
router.get('/returns', controller.adminControllers.returnController.getReturnsPage )

//edit return status
router.put('/return', controller.adminControllers.returnController.editReturnStatus)

// sales page
router.get('/sales', controller.adminControllers.salesController.getSalesPage)


//logout
router.get('/logout', controller.adminControllers.loginController.logout)

module.exports = router;
