const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const adminCategoryHelpers = require('../../helpers/admin/products/adminCategory-hepers');

const getCategoryPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let categories = await categoryHelpers.getCategoryDetails();
            console.log('categoriesss', categories[0]);
            res.render('admin/adminCategory/category/adminCategories', { layout: 'layout/layout', categories });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const getAddCategoryPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            res.render('admin/adminCategory/categoryUpdates/addCategory', { layout: 'layout/layout' });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const softDeleteSubcategory = async (req, res, next) => {
    const { subCategory, category } = req.body;

    try {
        let result = await adminCategoryHelpers.deleteSubcategory(subCategory, category);

        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const undoSoftDeleteSubcategory = async (req, res, next) => {
    const { subCategory, category } = req.body;

    try {
        let result = await adminCategoryHelpers.undoSubcategoryDelete(subCategory, category);

        if (result.status === 'undo delete') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const addSubcategory = async (req, res, next) => {
    try {
        let result = await adminCategoryHelpers.addSubCategory(req.body);

        if (result.status === 'added') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const getEditCategoryPage = async (req, res, next) => {
    let category = req.params.category;
    let subCategory = req.params.subcategory;
    let sessionId = req.cookies.adminSession;

    try {
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            res.render('admin/editCategory', { layout: 'layout/layout', category, subCategory });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const editSubcategory = async (req, res, next) => {
    try {
        let result = await adminCategoryHelpers.editSubCategory(req.body);

        if (result.status === 'added') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getCategoryPage,
    getAddCategoryPage,
    softDeleteSubcategory,
    undoSoftDeleteSubcategory,
    addSubcategory,
    getEditCategoryPage,
    editSubcategory,
}