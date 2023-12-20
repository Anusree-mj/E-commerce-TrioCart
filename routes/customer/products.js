const express = require('express');
const router = express.Router();
const controller = require("../../controllers");

// get all category products
router.get('/:category/viewAll', controller.customerControllers.categoryController.getCategoryProductsPage)

//get each subcategory products
router.get('/:category/:subcategory', controller.customerControllers.subcategoryController.getsubcategoryProductsPage)

// product details
router.get('/:productId', controller.customerControllers.productController.getProductDetailPage)

module.exports = router;