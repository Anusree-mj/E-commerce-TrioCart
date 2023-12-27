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
const getEditCashbackPage = async (req, res, next) => {
    try {
        let cashbackId = req.params.cashbackId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const cashback = await cashbackHelpers.getACashBackForEdit(cashbackId);
            res.render('admin/adminCashbacks/editCashback', {
                layout: 'layout/layout',
                cashback
            });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

const editCashback = async (req, res, next) => {
    try {
        let cashbackId = req.params.cashbackId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const cashbackUpdate = await cashbackHelpers.editCashback(cashbackId, req.body);

            if (cashbackUpdate.status === 'ok') {
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

const softDeleteCashback = async (req, res, next) => {
    try {
        let cashbackId = req.params.cashbackId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const cashbackUpdate = await cashbackHelpers.deleteCashback(cashbackId);

            if (cashbackUpdate.status === 'ok') {
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

const undoCashbackDelete = async (req, res, next) => {
    try {
        let cashbackId = req.params.cashbackId;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            const cashbackUpdate = await cashbackHelpers.undodeleteCashback(cashbackId);

            if (cashbackUpdate.status === 'ok') {
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
    getEditCashbackPage,
    editCashback,
    softDeleteCashback,
    undoCashbackDelete,
}
