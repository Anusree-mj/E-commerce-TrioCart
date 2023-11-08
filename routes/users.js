var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((product1,product2,product3,newProducts)=>{
    // console.log(product)
    res.render('users/home', { layout: 'layout/layout',product1,product2,product3,newProducts });
   })
});

module.exports = router;
