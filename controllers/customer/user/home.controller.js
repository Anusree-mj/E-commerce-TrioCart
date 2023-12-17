const sessionHelpers = require('../../../helpers/user/session-helpers');
const categoryHelpers = require('../../../helpers/user/category-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');
const productHelpers = require('../../../helpers/user/product-helpers');

const getHomePage = async (req, res, next) => {
    let sessionId = req.cookies.session

    let products = await productHelpers.getNewArrivalProducts();
    let allCategories = await categoryHelpers.getCategoryDetails()
   
    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user
            let userId = result.user._id

            cartHelpers.getMyCartProducts(userId).then((result) => {
                if (result) {
                    let totalCartProduct = result.totalCount;
                    res.render('customers/customer/home', { layout: 'layout/layout', products, allCategories, user: user, totalCartProduct });
                }
            })
        } else {
            res.render('customers/customer/home', { layout: 'layout/layout', products, allCategories, user: undefined });
        }
    });
}

module.exports ={
    getHomePage
}