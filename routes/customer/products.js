var express = require('express');
var router = express.Router();

const productHelpers = require('../../helpers/user/product-helpers')
const userHelpers = require('../../helpers/user/user-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');

// get all category products
router.get('/:category/viewAll', async function (req, res, next) {
  const category = req.params.category
  let allCategories = await categoryHelpers.getCategoryDetails()
  let query = req.query.q;
  let size = req.query.size;
  let price = req.query.price;

  categoryHelpers.viewAllProductsofEAchCAtegory(category, query, size, price).then((result) => {
    let products = result.products;
    let categories = result.categories;
    let searchProducts = result.searchProducts;
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
      const isAuthenticated = result.status === 'ok';
      if (isAuthenticated) {
        let user = result.user
        let userId = result.user._id

        cartHelpers.getMyCartProducts(userId).then((result) => {
          if (result) {
            let totalCartProduct = result.totalCount
            res.render('users/categoryProducts', {
              layout: 'layout/layout', allCategories, category,
              searchProducts, products, categories, user, totalCartProduct
            })
          }
        })
      } else {
        res.render('users/categoryProducts', {
          layout: 'layout/layout', allCategories, category,
          searchProducts, products, categories, user: undefined
        })
      }
    })
  })
})

//get each subcategory products
router.get('/:category/:subcategory', async function (req, res, next) {
  const category = req.params.category
  const subCategory = req.params.subcategory
  let query = req.query.q;
  let size = req.query.size;
  let price = req.query.price;

  let allCategories = await categoryHelpers.getCategoryDetails()

  categoryHelpers.viewEachSubcategoryProducts(category, subCategory, query, size, price).then((result) => {
    let categories = result.categories;
    let products = result.products;
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
      if (result.status === 'ok') {
        let user = result.user
        let userId = result.user._id

        cartHelpers.getMyCartProducts(userId).then((result) => {
          if (result) {
            let totalCartProduct = result.totalCount
            res.render('users/subCategoryProducts', { layout: 'layout/layout', allCategories, category, subCategory, categories, products, user, totalCartProduct })
          }
        })
      } else {
        res.render('users/subCategoryProducts', { layout: 'layout/layout', allCategories, category, subCategory, categories, products, user: undefined })

      }
    })
  })
})

// product details
router.get('/:productId', async function (req, res, next) {
  const productId = req.params.productId
  let allCategories = await categoryHelpers.getCategoryDetails()

  productHelpers.getAproduct(productId).then((result) => {
    let product = result;
    let category = result.category;
    let subCategory = result.subCategory

    categoryHelpers.viewEachSubcategoryProducts(category, subCategory).then(result => {
      let viewMoreProducts = result.products;
      let sessionId = req.cookies.session

      sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
          let user = result.user
          let userId = result.user._id

          cartHelpers.getMyCartProducts(userId).then((result) => {
            if (result) {
              let totalCartProduct = result.totalCount
              res.render('users/productDetails', { layout: 'layout/layout', allCategories, viewMoreProducts, product, user, totalCartProduct })
            }
          })
        } else {
          res.render('users/productDetails', { layout: 'layout/layout', allCategories, viewMoreProducts, product, user: undefined })

        }
      })
    })
  })
})

module.exports = router;