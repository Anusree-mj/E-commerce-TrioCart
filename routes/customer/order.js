const express = require('express');
const router = express.Router();
const controller = require("../../controllers")

// order success page
router.get('/success', controller.customerControllers.orderController.getOrderSuccessPage)

// get order history
router.get('/history', controller.customerControllers.orderController.getOrderHistoryPage)

// order details page
router.get('/details/:orderId', controller.customerControllers.orderController.getOrderDetailPage)

// cancel order 
router.put('/:orderId/cancel', controller.customerControllers.orderController.cancelOrder)

// return product 
router.post('/:productId/return', controller.customerControllers.orderController.returnProduct)

module.exports = router;