const productHelpers = require('../../helpers/user/product-helpers')
const categoryHelpers = require('../../helpers/user/category-helpers');
const sessionHelpers = require('../../helpers/user/session-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');


const getProductDetailPage = async (req, res, next) => {
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
                            res.render('customers/productDetails', { layout: 'layout/layout', allCategories, viewMoreProducts, product, user, totalCartProduct })
                        }
                    })
                }
                else {
                    res.render('customers/productDetails', { layout: 'layout/layout', allCategories, viewMoreProducts, product, user: undefined })

                }
            })
        })
    })
}

module.exports = {
    getProductDetailPage,
}