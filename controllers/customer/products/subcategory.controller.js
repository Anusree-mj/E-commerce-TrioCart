const categoryHelpers = require('../../../helpers/user/category-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');


const getsubcategoryProductsPage = async (req, res, next) => {
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
              res.render('customers/products/subCategoryProducts', { layout: 'layout/layout', allCategories, category, subCategory, categories, products, user, totalCartProduct })
            }
          })
        } else {
          res.render('customers/products/subCategoryProducts', { layout: 'layout/layout', allCategories, category, subCategory, categories, products, user: undefined })
  
        }
      })
    })
}

module.exports = {
  getsubcategoryProductsPage,
}