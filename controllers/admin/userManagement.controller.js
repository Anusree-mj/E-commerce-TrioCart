const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminUserHelpers = require('../../helpers/admin/manageUser/adminUser-helpers');

const getUserPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            adminUserHelpers.getUsers().then((users) => {
                console.log(users)
                res.render('admin/users', { layout: 'layout/layout', users });
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const softDeleteUser = (req, res, next) => {
    const userId = req.body.userId
    adminUserHelpers.blockUser(userId).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const undoSoftDeleteUser = (req, res, next) => {
    const userId = req.body.userId
    adminUserHelpers.unblockUser(userId).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

module.exports = {
    getUserPage,
    softDeleteUser,
    undoSoftDeleteUser,
}