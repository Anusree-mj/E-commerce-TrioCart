var express = require('express');
const { route } = require('./users');
var router = express.Router();
var path = require('path');
var productHelpers = require('../helpers/product-helpers')
const multer = require('multer');
const adminHelpers =require('../helpers/admin-helpers');
const uuidv4 = require('uuid').v4

const storage = multer.diskStorage({
  destination: ((req, file, cb) => {
    cb(null, './public/images/products');
  }),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//get adminlogin page
router.get('/', function (req, res, next) {
  res.render('admin/adminLogin', { layout: 'layout/layout' });
});

//admin loging in
router.post('/adminLogin',function(req,res,next){
  adminHelpers.dologin(req.body).then((result)=>{
    if(result){
      const sessionId = uuidv4();
      req.session.isAuthenticated = true;
      req.session.admin=result
      res.cookie('session', sessionId);
      res.status(200).json({ status: "ok" });
    }else{
      res.status(500).json({ status: "nok" });
    }
  })
})

/* GET users listing. */
router.get('/adminDashboard', function (req, res, next) {
  if (req.session.isAuthenticated) {
    let admin=req.session.admin
    console.log(admin)
      res.render('admin/adminDashboard', { layout: 'layout/layout',admin });
} else {
    res.redirect('/admin');
}
});

//get products list
router.get('/products', function (req, res, next) {
  if (req.session.isAuthenticated){
    productHelpers.getAllProducts().then((products) => {
      res.render('admin/adminProducts', { layout: 'layout/layout', products });
    })
  }
 else{
  res.redirect('/admin');
 }
});

//add product page
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

//get users list
router.get('/users', function (req, res, next) {
  if (req.session.isAuthenticated){
    adminHelpers.getUsers().then((users) => {
      console.log(users)
      res.render('admin/users', { layout: 'layout/layout', users });
    })
  }
 else{
  res.redirect('/admin');
 }
});

//block or unblock users
router.patch('/users/:user_id/',function (req, res, next) {
  const userId = req.params.user_id
  console.log(req.body);
  adminHelpers.blockOrUnblockUser(userId,req.body).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//get user edit page
router.get('/users/:user_id/edit', ((req, res, next) => {
  const userId = req.params.user_id
  adminHelpers. getUserforupdate(userId).then((user) => {
    console.log(user)
    if (user) {
      res.render('admin/editUsers', { user })
    } else {
      res.redirect('/products');
    }
  })
}))

//logout
router.get('/logout',function(req,res,next){
  if (req.session.isAuthenticated){
    req.session.destroy(function (err) {
      res.clearCookie('connect.sid');
      res.redirect('/admin');
  })
  }
  })
module.exports = router;
