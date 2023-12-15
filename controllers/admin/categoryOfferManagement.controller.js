const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminCategoryOfferHelpers = require('../../helpers/admin/category/categoryOffer-helpers');

const getCategoryOfferPage = (req, res, next) => {
    let category = req.params.category
    let subCategory = req.params.subcategory
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            adminCategoryOfferHelpers.getCategoryOfferDetails(subCategory, category).then(categoryDetails => {
                console.log('cafjsdfjaelf', categoryDetails)
                res.render('admin/adminCategory/categoryOffers/categoryOffer',
                    { layout: 'layout/layout', categoryDetails })
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const editCategoryOffer = (req, res, next) => {
    let category = req.params.category;
    let subCategory = req.params.subcategory;
    const {offer} =req.body;
    let sessionId = req.cookies.adminSession;
    
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            console.log('sdfsdf')
            adminCategoryOfferHelpers.editOffer(category,subCategory,offer).then((result) => {
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
    getCategoryOfferPage,
    editCategoryOffer,
}