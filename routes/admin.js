var express = require('express');
const { route } = require('./users');
var router = express.Router();
var path = require('path');
var productHelpers = require('../helpers/product-helpers')
const multer = require('multer');


const storage = multer.diskStorage({
  destination: ((req, file, cb) => {
    cb(null, './public/images/products');
  }),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/adminPanel', { layout: 'layout/layout' });
});

router.get('/products', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    console.log(products)
    res.render('admin/adminProducts', { layout: 'layout/layout', products });
  })

});

router.get('/addProduct', function (req, res, next) {
  res.render('admin/addProduct', { layout: 'layout/layout' })
})

//add products
router.post('/products', upload.single('image'), function (req, res, next) {
  console.log(req.body);
  console.log(req.file)
  productHelpers.addProduct(req.body, req.file).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//delete products
router.delete('/products/:product_Id', ((req, res, next) => {
  const productId = req.params.product_Id
  productHelpers.deleteAProduct(productId).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//get edit product page
router.get('/products/:product_Id/edit', ((req, res, next) => {
  const productId = req.params.product_Id
  console.log('Product ID:', productId);
  productHelpers. getProductForEditing(productId).then((productData) => {
    if (productData) {
      res.render('admin/editProduct', { productData })
    } else {
      res.redirect('/products');
    }
  })
}))

//edit products
router.patch('/products/:product_Id/', upload.single('image'), function (req, res, next) {
  const productId = req.params.product_Id
  console.log(req.body);
  console.log(req.file);
  productHelpers.editProduct(req.body, req.file, productId).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})


module.exports = router;
