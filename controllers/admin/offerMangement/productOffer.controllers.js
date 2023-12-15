const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminProductOfferHelpers = require('../../../helpers/admin/offerManagement/productOffer-helpers');

const getProductOfferPage = (req, res, next) => {
    let productId = req.params.productId;
    let sessionId = req.cookies.adminSession;

    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            adminProductOfferHelpers.getProductOfferDetails(productId).then(productDetails => {
                console.log('cafjsdfjaelf', productDetails)
                res.render('admin/adminProducts/productOffers/productOffer',
                    { layout: 'layout/layout', productDetails })
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const editProductOffer = (req, res, next) => {
    let productId = req.params.productId;
    let sessionId = req.cookies.adminSession;
    const {offer} =req.body;
        
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            console.log('sdfsdf')
           adminProductOfferHelpers.editOffer(productId,offer).then((result) => {
                console.log('updated',result)
                if (result.status === 'ok') {
                    res.status(200).json({ status: "ok" });
                } else {
                    res.status(500).json({ status: "nok" });
                }
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

 module.exports = {
    getProductOfferPage,
    editProductOffer
 }