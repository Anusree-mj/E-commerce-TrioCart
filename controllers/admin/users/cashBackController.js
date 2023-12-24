const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const cashbackHelpers = require('../../../helpers/admin/manageUser/cashBack-helpers');

const getCashbacksPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let cashbacks = await cashbackHelpers.getAllCashbacks();
            res.render('admin/adminCashbacks/cashbacks', {
                layout: 'layout/layout',
                cashbacks
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
            let insertStatus = await cashbackHelpers.addCoupon(req.body);
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
            const coupon = await cashbackHelpers.getACoupon(couponId);
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
            const editStatus = await cashbackHelpers.editCoupon(couponId, req.body);
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
    getCashbacksPage,
    getAddCouponsPage,
    addCoupon,
    getEditCouponsPage,
    editCoupon,
}
