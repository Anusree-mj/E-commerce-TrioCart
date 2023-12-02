var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers');

// get search page
router.get('/', async function (req, res, next) {
    let allCategories = await userHelpers.getCategoryDetails();
    let query = req.query.q
    console.log("queryyyyyyy", query)
    let sessionId = req.cookies.session

    userHelpers.checkSessions(sessionId).then((result) => {
        const isAuthenticated = result.status === 'ok';
        if (isAuthenticated) {
            let user = result.user
            let userId = result.user._id

            productHelpers.getSearchProduct(query).then(result => {
                if (result.status === 'ok') {
                    let searchProducts = result.searchProducts;

                    userHelpers.getMyCartProducts(userId).then((result) => {
                        if (result) {
                            let totalCartProduct = result.totalCount
                            res.render('users/search', {
                                layout: 'layout/layout', allCategories, user, totalCartProduct, searchProducts
                            })
                        }
                    })
                } else {
                    res.render('users/search', { layout: 'layout/layout', allCategories, user, searchProducts: undefined })
                }
            })
        } else {
            res.render('users/search', { layout: 'layout/layout', allCategories, user: undefined, searchProducts })
        }
    })
})

module.exports = router;