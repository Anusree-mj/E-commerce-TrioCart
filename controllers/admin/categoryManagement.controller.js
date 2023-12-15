const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const adminCategoryHelpers = require('../../helpers/admin/products/adminCategory-hepers');

const getCategoryPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            categoryHelpers.getCategoryDetails().then((categories) => {
                console.log('categoriesss',categories[0])
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
    const {subCategory,category} = req.body
    adminCategoryHelpers.deleteSubcategory(subCategory,category).then((result) => {
        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const undoSoftDeleteSubcategory = (req, res, next) => {
    const {subCategory,category} = req.body
    adminCategoryHelpers.undoSubcategoryDelete(subCategory,category).then((result) => {
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

const getEditCategoryPage = (req, res, next) => {
    let category = req.params.category
    let subCategory = req.params.subcategory
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            res.render('admin/editCategory', { layout: 'layout/layout',category,subCategory })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const editSubcategory = (req, res, next) => {
    adminCategoryHelpers.editSubCategory(req.body).then((result) => {
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
    getEditCategoryPage,
    editSubcategory,
}