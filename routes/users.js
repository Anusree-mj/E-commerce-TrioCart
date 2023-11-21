var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');

/* GET  home page. */
router.get('/', async function (req, res, next) {
  let sessionId = req.cookies.session
  let products = await productHelpers.getNewArrivalProducts();
  let allCategories = await userHelpers.getCategoryDetails()
  userHelpers.checkSessions(sessionId).then((result) => {
    if (result.status === 'ok') {
      userHelpers.getUser(result.email).then((user) => {
        console.log("userrrrrr innnnnn homeeeeeeeee:", user)
        res.render('users/home', { layout: 'layout/layout', products, allCategories, user: user });
      })
    } else {
      res.render('users/home', { layout: 'layout/layout', products, allCategories, user: undefined });
    }
  });
})

/* get cart. */
router.get('/cart', async function (req, res, next) {
  let allCategories = await userHelpers.getCategoryDetails()
  let category = 'Ladies'
  let subCategory = 'Dresses'

  productHelpers.viewEachSubcategoryProducts(category, subCategory).then(result => {
    let viewMoreProducts = result.products;

    let sessionId = req.cookies.session
    userHelpers.checkSessions(sessionId).then((result) => {
      if (result.status === 'ok') {
        let cartproducts = {}
        userHelpers.getUser(result.email).then((user) => {
          res.render('users/cart', {
            layout: 'layout/layout', cartproducts:undefined, allCategories, user: user, viewMoreProducts,
          });
        })
      } else {
        res.redirect('/user/login')
      }
    });
  })
})

//logout
router.get('/logout', function (req, res, next) {
  let sessionId = req.cookies.session
  userHelpers.deleteSessions(sessionId).then((result) => {
    if (result) {
      req.session.isAuthenticated = false;
      req.session.destroy(function (err) {
        res.clearCookie('session');
        res.redirect('/');
      })
    }
  })

})

module.exports = router;
