var express = require('express');
const { route } = require('../customer/users');
var router = express.Router();
var path = require('path');
const controller = require("../../controllers")

const productHelpers = require('../../helpers/user/product-helpers')
const adminOrderHelpers = require('../../helpers/admin/orders/adminOrder-helpers');
const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminUserHelpers = require('../../helpers/admin/manageUser/adminUser-helpers');
const adminImgStockHelpers = require('../../helpers/admin/products/adminImgStock-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const adminProductHelpers = require('../../helpers/admin/products/adminProduct-helpers');
const adminCategoryHelpers = require('../../helpers/admin/products/adminCategory-hepers');


const uuidv4 = require('uuid').v4

//admin page
router.get('/', controller.adminControllers.dashboardController.getDashboardPage);

//get adminlogin page
router.get('/login', controller.adminControllers.loginController.getLoginPage);

//admin loging in
router.post('/adminLogin', controller.adminControllers.loginController.sendAdminLoginRequest)

//get products list
router.get('/products', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminLoginHelpers.checkSessions(sessionId).then(result => {
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
  adminLoginHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      res.render('admin/addProduct', { layout: 'layout/layout' })
    }
    else {
      res.redirect('/admin');
    }
  })
})

//add products
router.post('/product', function (req, res, next) {

  adminProductHelpers.addProduct(req.body).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//delte product main image
router.delete('/products/mainImage', ((req, res, next) => {
  const productId = req.body.productId

  adminImgStockHelpers.deleteMainImage(productId).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//delte product detailed image
router.delete('/products/image', ((req, res, next) => {
  const image = req.body.image
  const productId = req.body.productId
  console.log('image id in delet router:', image);
  console.log('product id in delet router:', productId);
  adminImgStockHelpers.deleteAProductImage(image, productId).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//delete products
router.delete('/products/dlt/:product_Id', ((req, res, next) => {
  const productId = req.params.product_Id
  adminProductHelpers.deleteAProduct(productId).then((result) => {
    if (result.status === 'deleted') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//undo product delete
router.put('/products/dlt/:product_id', ((req, res, next) => {
  console.log('entereddd')
  const productId = req.params.product_id
  console.log(productId, "iddd")

  adminProductHelpers.undoProductDelete(productId).then((result) => {
    if (result.status === 'undo delete') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//get edit product page
router.get('/products/:product_Id', ((req, res, next) => {
  const productId = req.params.product_Id
  console.log('Product ID:', productId);
  adminProductHelpers.getProductForEditing(productId).then((productData) => {
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
  adminProductHelpers.editProduct(req.body, productId).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//get edit stockproduct  page
router.get('/products/:product_Id/stock', ((req, res, next) => {
  const productId = req.params.product_Id
  console.log('Product ID:', productId);
  adminProductHelpers.getProductForEditing(productId).then((productData) => {
    if (productData) {
      res.render('admin/editStockProduct', { productData })
    } else {
      res.redirect('/products');
    }
  })
}))

//edit products stock
router.put('/products/:product_Id/stock', function (req, res) {
  const productId = req.params.product_Id
  adminImgStockHelpers.editStock(req.body, productId).then((result) => {
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
  adminLoginHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      categoryHelpers.getCategoryDetails().then((categories) => {
        res.render('admin/adminCategories', { layout: 'layout/layout', categories });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
}))

//add category page
router.get('/addCategory', async function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminLoginHelpers.checkSessions(sessionId).then(result => {
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
  adminCategoryHelpers.deleteSubcategory(subCategory).then((result) => {
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
  console.log(subCategory, "subbbcatgry")
  adminCategoryHelpers.undoSubcategoryDelete(subCategory).then((result) => {
    if (result.status === 'undo delete') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
}))

//add subcategory
router.post('/category', ((req, res, next) => {
  adminCategoryHelpers.addSubCategory(req.body).then((result) => {
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
  adminLoginHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {
      adminUserHelpers.getUsers().then((users) => {
        console.log(users)
        res.render('admin/users', { layout: 'layout/layout', users });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
});

//block users
router.delete('/users', function (req, res, next) {
  const userId = req.body.userId

  adminUserHelpers.blockUser(userId).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//unblock users
router.put('/users', function (req, res, next) {
  const userId = req.body.userId
  console.log('userId', userId)

  adminUserHelpers.unblockUser(userId).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

//get orders list
router.get('/orders', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminLoginHelpers.checkSessions(sessionId).then(result => {
    if (result.status === 'ok') {

      adminOrderHelpers.getAllOrders().then((results) => {
        let orders = results.orders

        res.render('admin/adminOrders', { layout: 'layout/layout', orders });
      })
    }
    else {
      res.redirect('/admin');
    }
  })
});

//edit order status
router.put('/orders', function (req, res) {
  let data = req.body
  console.log("ssssssssss", data)

  adminOrderHelpers.updateOrderStatus(data).then((result) => {
    if (result.status === 'ok') {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(500).json({ status: "nok" });
    }
  })
})

// order details page
router.get('/order/:orderId', async function (req, res, next) {
  let orderId = req.params.orderId;
  let sessionId = req.cookies.adminSession

  adminLoginHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      adminOrderHelpers.getAnOrder(orderId).then((result) => {
        let order = result.order

        res.render('admin/adminOrderDetails', { layout: 'layout/layout', order });
      })
    } else {
      res.redirect('/admin/login')
    }
  })
})




//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.adminSession
  adminLoginHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.redirect('/admin');
      })
    }
  })
})
module.exports = router;
