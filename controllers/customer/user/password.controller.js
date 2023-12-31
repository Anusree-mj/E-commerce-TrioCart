const userUpdateHelpers = require('../../../helpers/user/userHelpers/userUpdate-helpers');

const getForgotPasswordPage = (req, res, next) => {
    res.render('customers/logins/changePassword', { layout: 'layout/layout' });
}

const sendForgotPasswordRequest = (req, res, next) => {
    let email = req.body.email
    let password = req.body.password
    userUpdateHelpers.updatePassword(email, password).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    })
}


module.exports = {
    getForgotPasswordPage,
    sendForgotPasswordRequest
}