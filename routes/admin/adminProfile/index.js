var express = require('express');
const { route } = require('./users');
var router = express.Router();
var path = require('path');

const adminLoginHelpers = require('../helpers/admin/login/adminLogin-helpers');

const uuidv4 = require('uuid').v4

//admin page
router.get('/', function (req, res, next) {
    let sessionId = req.cookies.adminSession
    console.log('session id of admin: ', sessionId)
    adminLoginHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            adminLoginHelpers.getAdmin(result.adminId).then((admin) => {
                res.render('admin/adminDashboard', { layout: 'layout/layout', admin });
            })
        }
        else {
            res.redirect('/admin/login');
        }
    });
});

//get adminlogin page
router.get('/login', function (req, res, next) {
    res.render('admin/adminLogin', { layout: 'layout/layout' });
});

//admin loging in
router.post('/adminLogin', function (req, res, next) {
    adminLoginHelpers.dologin(req.body).then((admin) => {
        if (admin) {
            const sessionId = uuidv4();
            const adminId = admin.email
            adminLoginHelpers.saveSessions(sessionId, adminId)
            res.cookie('adminSession', sessionId);
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    })
})

module.exports = router;