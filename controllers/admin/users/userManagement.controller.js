const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminUserHelpers = require('../../../helpers/admin/manageUser/adminUser-helpers');

const getUserPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let users = await adminUserHelpers.getUsers();
            res.render('admin/adminUsers/users', { layout: 'layout/layout', users });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        next(error);
    }
};

const softDeleteUser = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        let result = await adminUserHelpers.blockUser(userId);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        next(error);
    }
};

const undoSoftDeleteUser = async (req, res, next) => {
    const userId = req.body.userId;

    try {
        let result = await adminUserHelpers.unblockUser(userId);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getUserPage,
    softDeleteUser,
    undoSoftDeleteUser,
}