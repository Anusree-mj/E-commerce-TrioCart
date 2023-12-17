const sessionHelpers = require('../../../helpers/user/session-helpers');
const categoryHelpers = require('../../../helpers/user/category-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');

const getCouponPage = async (req, res, next) => {
    let sessionId = req.cookies.session
    let allCategories = await categoryHelpers.getCategoryDetails()

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user
            let userId = result.user._id
            cartHelpers.getMyCartProducts(userId).then((result) => {
                if (result) {
                    let totalCartProduct = result.totalCount;
                    res.render('customers/customer/coupons', { layout: 'layout/layout', allCategories, user: user, totalCartProduct });
                }
            })
        } else {
            res.redirect('/user/login')
        }
    });
}
module.exports = {
    getCouponPage,
}