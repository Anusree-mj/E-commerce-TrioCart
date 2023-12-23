const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminCategoryOfferHelpers = require('../../../helpers/admin/offerManagement/categoryOffer-helpers');

const getCategoryOfferPage = async (req, res, next) => {
    try {
        let category = req.params.category;
        let subCategory = req.params.subcategory;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let categoryDetails = await adminCategoryOfferHelpers.getCategoryOfferDetails(subCategory, category);
            res.render('admin/adminCategory/categoryOffers/categoryOffer', { layout: 'layout/layout', categoryDetails });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const editCategoryOffer = async (req, res, next) => {
    try {
        let category = req.params.category;
        let subCategory = req.params.subcategory;
        const { offer } = req.body;
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let editResult = await adminCategoryOfferHelpers.editOffer(category, subCategory, offer);

            if (editResult.status === 'ok') {
                res.status(200).json({ status: "ok" });
            } else {
                res.status(500).json({ status: "nok" });
            }
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};


module.exports = {
    getCategoryOfferPage,
    editCategoryOffer,
}