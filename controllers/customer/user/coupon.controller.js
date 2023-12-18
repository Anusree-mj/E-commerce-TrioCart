const sessionHelpers = require('../../../helpers/user/session-helpers');
const categoryHelpers = require('../../../helpers/user/category-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');
const couponHelpers = require('../../../helpers/user/coupon-helpers');

const getCouponPage = async (req, res, next) => {
    let sessionId = req.cookies.session
    let allCategories = await categoryHelpers.getCategoryDetails()

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user
            console.log('usret', user)
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

const addCoupon = async (req, res, next) => {
    let sessionId = req.cookies.session;
    const referral = req.body.referralCode;

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let userId = result.user._id
            couponHelpers.addCoupon(userId, referral).then(result => {
                if (result.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                } else {
                    res.status(400).json({ status: "nok" });
                }
            })
        } else {
            res.redirect('/user/login')
        }
    });
}

const applyCoupon = async (req, res, next) => {
    let sessionId = req.cookies.session;
    let { couponName, totalprice, cartId } = req.body;
    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {

            let userId = result.user._id
            couponHelpers.applyCoupon(userId, couponName, totalprice,cartId).then(result => {

                if (result.status === 'ok') {
                    const discountPrice = result.discount
                    console.log('discount', discountPrice)
                    res.status(200).json({ status: "ok", discountPrice });
                } 
                else {
                    res.status(400).json({ status: "nok" });
                }
            })
        }
        else {
            res.redirect('/user/login')
        }
    });
}

module.exports = {
    getCouponPage,
    addCoupon,
    applyCoupon,
}