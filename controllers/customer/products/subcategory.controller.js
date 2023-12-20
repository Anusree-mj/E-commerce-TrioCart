const categoryHelpers = require('../../../helpers/user/category-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');

const getsubcategoryProductsPage = async (req, res, next) => {
  try {
      const category = req.params.category;
      const subCategory = req.params.subcategory;
      let query = req.query.q;
      let size = req.query.size;
      let price = req.query.price;

      let allCategories = await categoryHelpers.getCategoryDetails();

      let result = await categoryHelpers.viewEachSubcategoryProducts(category, subCategory, query, size, price);
      let categories = result.categories;
      let products = result.products;
      let sessionId = req.cookies.session;

      let sessionResult = await sessionHelpers.checkSessions(sessionId);

      if (sessionResult.status === 'ok') {
          let user = sessionResult.user;
          let userId = user._id;

          let cartResult = await cartHelpers.getMyCartProducts(userId);

          if (cartResult) {
              let totalCartProduct = cartResult.totalCount;
              res.render('customers/products/subCategoryProducts', {
                  layout: 'layout/layout',
                  allCategories,
                  category,
                  subCategory,
                  categories,
                  products,
                  user,
                  totalCartProduct
              });
          }
      } else {
          res.render('customers/products/subCategoryProducts', {
              layout: 'layout/layout',
              allCategories,
              category,
              subCategory,
              categories,
              products,
              user: undefined
          });
      }
  } catch (error) {
      console.error(error);    
  }
};

module.exports = {
  getsubcategoryProductsPage,
}