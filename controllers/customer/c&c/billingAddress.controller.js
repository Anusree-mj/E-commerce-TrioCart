const sessionHelpers = require('../../../helpers/user/session-helpers');
const billingAddressHelpers = require('../../../helpers/user/billingAddress-helpers');

const saveBillingAddress = (req, res, next) => {
    let user = req.body
    billingAddressHelpers.saveBillingAddress(user).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    })
}

const getEditBillingAddressDiv = (req, res, next) => {
    let addressId = req.params.adressId;
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            billingAddressHelpers.getBillingAddress(addressId).then(result => {
                if (result.address) {
                    let address = result.address

                    res.status(200).json({ status: "ok", address });
                } else {
                    res.status(400).json({ status: "nok" });
                }
            })
        } else {
            res.redirect('/user/login')
        }
    })
}

const deletBillingAddress = (req, res, next) => {
    let addressId = req.params.adressId;
    let sessionId = req.cookies.session
    console.log('addressid', addressId)

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let userId = result.user._id

            billingAddressHelpers.deleteBillingAddress(addressId, userId).then(result => {
                if (result.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                }
                else {
                    res.status(400).json({ status: "nok" });
                }
            })
        }
        else {
            res.redirect('/user/login')
        }
    })
}

const updateBillingAddress = (req, res, next) => {
    let billingAddress = req.body;
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            billingAddressHelpers.updateBillingAddress(billingAddress).then(result => {
                if (result.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                }
                else {
                    res.status(400).json({ status: "nok" });
                }
            })
        }
        else {
            res.redirect('/user/login')
        }
    })
}

module.exports = {
    saveBillingAddress,
    getEditBillingAddressDiv,
    deletBillingAddress,
    updateBillingAddress,

}