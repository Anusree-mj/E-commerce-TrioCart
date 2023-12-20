const sessionHelpers = require('../../../helpers/user/session-helpers');
const billingAddressHelpers = require('../../../helpers/user/billingAddress-helpers');

const saveBillingAddress = async (req, res, next) => {
    try {
        let user = req.body;
        let result = await billingAddressHelpers.saveBillingAddress(user);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(400).json({ status: "nok" });
        }
    } catch (error) {
        next(error);
    }
};

const getEditBillingAddressDiv = async (req, res, next) => {
    try {
        let addressId = req.params.adressId;
        let sessionId = req.cookies.session;
        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let addressResult = await billingAddressHelpers.getBillingAddress(addressId);

            if (addressResult.address) {
                let address = addressResult.address;
                res.status(200).json({ status: "ok", address });
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

const deletBillingAddress = async (req, res, next) => {
    try {
        let addressId = req.params.adressId;
        let sessionId = req.cookies.session;

        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let userId = result.user._id;
            let deleteResult = await billingAddressHelpers.deleteBillingAddress(addressId, userId);

            if (deleteResult.status === 'ok') {
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

const updateBillingAddress = async (req, res, next) => {
    try {
        let billingAddress = req.body;
        let sessionId = req.cookies.session;

        let result = await sessionHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let updateResult = await billingAddressHelpers.updateBillingAddress(billingAddress);

            if (updateResult.status === 'ok') {
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

module.exports = {
    saveBillingAddress,
    getEditBillingAddressDiv,
    deletBillingAddress,
    updateBillingAddress,

}