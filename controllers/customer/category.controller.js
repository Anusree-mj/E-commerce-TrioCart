const categoryHelpers = require('../../helpers/user/category-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');


const getCategoryProductsPage = async (req, res, next) => {
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
}

module.exports = {
    getCategoryProductsPage,
}