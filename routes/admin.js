var express = require('express');
const { route } = require('./users');
var router = express.Router();
var path = require('path');
var productHelpers = require('../helpers/product-helpers')
const multer = require('multer');
const adminHelpers = require('../helpers/admin-helpers');
const productUpdateHelpers = require('../helpers/productUpdate-helpers');
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
router.post('/product', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'detailedImages', maxCount: 5 }
]), function (req, res, next) {
  const mainImage = req.files['image'] ? req.files['image'][0] : null;
  const detailedImages = req.files['detailedImages'] || [];
  productUpdateHelpers.addProduct(req.body, mainImage, detailedImages).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//delte product image
router.delete('/products/image', ((req, res, next) => {
  const image = req.body.image
  const productId = req.body.productId
  console.log('image id in delet router:', image);
  console.log('product id in delet router:', productId);
  productUpdateHelpers.deleteAProductImage(image, productId).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//delete products
router.patch('/products/dlt/:product_Id', ((req, res, next) => {
    const productId = req.params.product_Id
  productUpdateHelpers.deleteAProduct(productId).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//undo product delete
router.patch('/products/dlt/:product_id/undo', ((req, res, next) => {
  console.log('entereddd')
  const productId = req.params.product_id
   console.log(productId,"iddd")

  productUpdateHelpers.undoProductDelete(productId).then((result) => {
    if (result.status === 'undo delete') {
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
  productUpdateHelpers.getProductForEditing(productId).then((productData) => {
    if (productData) {
      res.render('admin/editProduct', { productData })
    } else {
      res.redirect('/products');
    }
  })
}))

//edit products
router.put('/products/:product_Id', function (req, res) {
  const productId = req.params.product_Id
  console.log("ssssssssss", req.body, productId)
  productUpdateHelpers.editProduct(req.body, productId).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//get category page
router.get('/category', ((req, res, next) => {
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

//delete subcategory
router.patch('/category', ((req, res, next) => {
  const subCategory = req.body.subCategory
  productUpdateHelpers.deleteSubcategory(subCategory).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//undo subcategory delete
router.patch('/subcategory/undo', ((req, res, next) => {
  const subCategory = req.body.subCategory
  console.log(subCategory,"subbbcatgry")
  productUpdateHelpers.undoSubcategoryDelete(subCategory).then((result) => {
    if (result.status === 'undo delete') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//add subcategory
router.post('/category', ((req, res, next) => {
  productUpdateHelpers.addSubCategory(req.body).then((result) => {
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
  const userStatus = req.body.userEdit
  adminHelpers.blockOrUnblockUser(email, userStatus).then((result) => {
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
