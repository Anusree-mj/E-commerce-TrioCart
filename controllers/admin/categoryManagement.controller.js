const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const adminCategoryHelpers = require('../../helpers/admin/products/adminCategory-hepers');

const getCategoryPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            categoryHelpers.getCategoryDetails().then((categories) => {
                res.render('admin/adminCategories', { layout: 'layout/layout', categories });
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const getAddCategoryPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            res.render('admin/addCategory', { layout: 'layout/layout' })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const softDeleteSubcategory = (req, res, next) => {
    const subCategory = req.body.subCategory
    adminCategoryHelpers.deleteSubcategory(subCategory).then((result) => {
        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const undoSoftDeleteSubcategory = (req, res, next) => {
    const subCategory = req.body.subCategory
    adminCategoryHelpers.undoSubcategoryDelete(subCategory).then((result) => {
        if (result.status === 'undo delete') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const addSubcategory = (req, res, next) => {
    adminCategoryHelpers.addSubCategory(req.body).then((result) => {
        if (result.status === 'added') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

module.exports = {
    getCategoryPage,
    getAddCategoryPage,
    softDeleteSubcategory,
    undoSoftDeleteSubcategory,
    addSubcategory,


}