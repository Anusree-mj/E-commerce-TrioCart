const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const couponHelpers = require('../../../helpers/admin/manageUser/coupon-helpers');

const getCouponsPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let coupons = await couponHelpers.getAllCoupons();
            res.render('admin/adminCoupons/coupons', {
                layout: 'layout/layout',
                coupons
            });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

const getAddCouponsPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            res.render('admin/adminCoupons/addCoupon', {
                layout: 'layout/layout',
            });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

const addCoupon = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let insertStatus = await couponHelpers.addCoupon(req.body);
            if (insertStatus.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }

        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

const getEditCouponsPage = async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const coupon = await couponHelpers.getACoupon(couponId);
            res.render('admin/adminCoupons/editCoupon', {
                layout: 'layout/layout', coupon
            });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

const editCoupon = async (req, res, next) => {
    try {
        const couponId = req.params.couponId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const editStatus = await couponHelpers.editCoupon(couponId, req.body);
            if (editStatus.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(400).json({ status: "nok" });
            }
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCouponsPage,
    getAddCouponsPage,
    addCoupon,
    getEditCouponsPage,
    editCoupon,
}
