var express = require('express');
const { route } = require('./users');
var router = express.Router();
var path = require('path');
var productHelpers=require('../helpers/product-helpers')
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
 productHelpers.getAllProducts().then((products)=>{
  console.log(products)
  res.render('admin/adminProducts', { layout: 'layout/layout',products });
 })
  
});

router.get('/addProduct',function(req,res,next){
  res.render('admin/addProduct', { layout: 'layout/layout'})
})
//
router.post('/products', upload.single('image'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file)
  productHelpers.addProduct(req.body,req.file).then((result)=>{
    if(result.status==='ok'){
      res.status(200).json({ status: "ok" });
    }else{
      res.status(500).json({ status: "nok" });
    }
  })
})


module.exports = router;
