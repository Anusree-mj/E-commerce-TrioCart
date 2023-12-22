const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const couponHelpers = require('../../../helpers/admin/manageUser/coupon-helpers');

const getCouponsPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let coupons = await couponHelpers.getAllCoupons();
            console.log(coupons,'coupons')
            res.render('admin/adminCoupons/coupons', { layout: 'layout/layout',
            coupons });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const getAddCouponsPage = async (req, res, next) => {
    try {      
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {           
            res.render('admin/adminCoupons/addCoupon', { layout: 'layout/layout',
             });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const addCoupon = async (req, res, next) => {
    try {
        console.log('entered in add coupon function')
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {           
            let insertStatus = await couponHelpers.addCoupon(req.body);
            if(insertStatus.status==='ok'){
                res.status(200).json({ status: "ok" });
            }else{
                res.status(200).json({ status: "nok" });
            }
           
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getCouponsPage,
    getAddCouponsPage,
    addCoupon,
}
