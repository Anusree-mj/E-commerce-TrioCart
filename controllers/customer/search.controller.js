const categoryHelpers = require('../../helpers/user/category-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const productQueryHelpers = require('../../helpers/user/productQuery-helpers')
const cartHelpers = require('../../helpers/user/cart-helpers');

const searchProduct = async (req, res, next) => {
    let allCategories = await categoryHelpers.getCategoryDetails()
    let query = req.query.q
    console.log("queryyyyyyy", query)
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
        const isAuthenticated = result.status === 'ok';
        if (isAuthenticated) {
            let user = result.user
            let userId = result.user._id

            productQueryHelpers.getSearchProduct(query).then(result => {
                if (result.status === 'ok') {
                    let searchProducts = result.searchProducts;

                    cartHelpers.getMyCartProducts(userId).then((result) => {
                        if (result) {
                            let totalCartProduct = result.totalCount
                            res.render('customers/search', {
                                layout: 'layout/layout', allCategories, user, totalCartProduct, searchProducts
                            })
                        }
                    })
                } else {
                    res.render('customers/search', { layout: 'layout/layout', allCategories, user, searchProducts: undefined })
                }
            })
        } else {
            res.render('customers/search', { layout: 'layout/layout', allCategories, user: undefined, searchProducts })
        }
    })
}

module.exports = {
    searchProduct
}