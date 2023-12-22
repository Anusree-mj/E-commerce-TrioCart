const sessionHelpers = require('../../../helpers/user/session-helpers');
const categoryHelpers = require('../../../helpers/user/category-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');
const couponHelpers = require('../../../helpers/user/coupon-helpers');
const adminCouponHelpers = require('../../../helpers/admin/manageUser/coupon-helpers');

const getCouponPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let allCategories = await categoryHelpers.getCategoryDetails();

        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let user = result.user;
            console.log('user', user);
            let userId = result.user._id;
            let cartResult = await cartHelpers.getMyCartProducts(userId);

            if (cartResult) {
                let totalCartProduct = cartResult.totalCount;
                let coupons = await adminCouponHelpers.getAllCoupons();
                res.render('customers/customer/coupons', {
                    layout: 'layout/layout', allCategories, user, totalCartProduct
                    ,coupons
                });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const addCoupon = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        const referral = req.body.referralCode;

        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let userId = result.user._id;
            let couponResult = await couponHelpers.addCoupon(userId, referral);

            if (couponResult.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

const applyCoupon = async (req, res, next) => {
    try {
        let sessionId = req.cookies.session;
        let { couponId, totalprice, cartId } = req.body;

        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let userId = result.user._id;
            let couponResult = await couponHelpers.applyCoupon(userId, couponId, totalprice, cartId);

            if (couponResult.status === 'ok') {
                const discountPrice = couponResult.discount;
                console.log('discount', discountPrice);
                res.status(200).json({ status: "ok", discountPrice });
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCouponPage,
    addCoupon,
    applyCoupon,
}