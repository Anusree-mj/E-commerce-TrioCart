var express = require('express');
const { route } = require('./users');
var router = express.Router();
var path = require('path');
var productHelpers = require('../helpers/product-helpers')
const multer = require('multer');
const adminHelpers = require('../helpers/admin-helpers');
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

//admin page
router.get('/', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  console.log('session id of admin: ', sessionId)
  adminHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      adminHelpers.getAdmin(result.adminId).then((admin) => {
        res.render('admin/adminDashboard', { layout: 'layout/layout', admin });
      })
    }
    else {
      res.redirect('/admin/login');
    }
  });
});

//get adminlogin page
router.get('/login', function (req, res, next) {
  res.render('admin/adminLogin', { layout: 'layout/layout' });
});

//admin loging in
router.post('/adminLogin', function (req, res, next) {
  adminHelpers.dologin(req.body).then((admin) => {
    if (admin) {
      const sessionId = uuidv4();
      const adminId = admin.email
      adminHelpers.saveSessions(sessionId, adminId)
      res.cookie('adminSession', sessionId);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "nok" });
    }
  })
})



//get products list
router.get('/products', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      productHelpers.getAllProducts().then((products) => {
        res.render('admin/adminProducts', { layout: 'layout/layout', products });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
});

//add product page
router.get('/addProduct', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      res.render('admin/addProduct', { layout: 'layout/layout' })
    }
    else {
      res.redirect('/admin');
    }
  })
})

//add products
router.post('/product', upload.single('image'), function (req, res, next) {
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
router.patch('/products/dlt/:product_Id', ((req, res, next) => {
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
  productHelpers.getProductForEditing(productId).then((productData) => {
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

//get category page
router.get('/category',((req,res,next) =>{
  let sessionId = req.cookies.adminSession
  adminHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      productHelpers.getAllCategories().then((categories) => {
        res.render('admin/adminCategories', { layout: 'layout/layout', categories });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
}))

//add category page
router.get('/addCategory', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      res.render('admin/addCategory', { layout: 'layout/layout' })
    }
    else {
      res.redirect('/admin');
    }
  })
})

//delete category
router.patch('/category', ((req, res, next) => {
  const subCategory = req.body.subCategory
    productHelpers.deleteSubcategory(subCategory).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//add subcategory
router.post('/category', ((req, res, next) => {
    productHelpers.addSubCategory(req.body).then((result) => {
    if (result.status === 'added') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))



//get users list
router.get('/users', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      adminHelpers.getUsers().then((users) => {
        console.log(users)
        res.render('admin/users', { layout: 'layout/layout', users });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
});

//block or unblock users
router.patch('/users', function (req, res, next) {
  const email = req.body.userEmail
  const userStatus=req.body.userEdit
       adminHelpers.blockOrUnblockUser(email,userStatus).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})


//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.redirect('/admin');
      })
    }
  })
})
module.exports = router;
