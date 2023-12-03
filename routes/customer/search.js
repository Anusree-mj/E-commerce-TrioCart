const express = require('express');
const router = express.Router();
const controller = require("../../controllers")

// get search page
router.get('/', controller.customerControllers.searchController.searchProduct)

module.exports = router;