const adminLoginHelpers = require('../../../helpers/admin/login/adminLogin-helpers');
const adminProductHelpers = require('../../../helpers/admin/products/adminProduct-helpers');
const adminImgStockHelpers = require('../../../helpers/admin/products/adminImgStock-helpers');
const productHelpers = require('../../../helpers/user/product-helpers')

const getProductPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let products = await productHelpers.getAllProducts();
            res.render('admin/adminProducts/products/adminProducts', { layout: 'layout/layout', products });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const getAddProductPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            res.render('admin/adminProducts/productUpdates/addProduct', { layout: 'layout/layout' });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const addProduct = async (req, res, next) => {
    try {
        let result = await adminProductHelpers.addProduct(req.body);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const softDeleteProductMainImage = async (req, res, next) => {
    const productId = req.body.productId;

    try {
        let result = await adminImgStockHelpers.deleteMainImage(productId);

        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const softDeleteProductDetailedImage = async (req, res, next) => {
    const image = req.body.image;
    const productId = req.body.productId;

    try {
        let result = await adminImgStockHelpers.deleteAProductImage(image, productId);

        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const softDeleteProduct = async (req, res, next) => {
    const productId = req.params.product_Id;

    try {
        let result = await adminProductHelpers.deleteAProduct(productId);

        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const undoSoftDeleteProduct = async (req, res, next) => {
    const productId = req.params.product_id;

    try {
        let result = await adminProductHelpers.undoProductDelete(productId);

        if (result.status === 'undo delete') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

const getEditProductPage = async (req, res, next) => {
    const productId = req.params.product_Id;

    try {
        let productData = await adminProductHelpers.getProductForEditing(productId);

        if (productData) {
            res.render('admin/adminProducts/productUpdates/editProduct', { productData });
        } else {
            res.redirect('/products');
        }
    } catch (error) {
        console.error(error);
    }
};

const editProduct = async (req, res, next) => {
    const productId = req.params.product_Id;

    try {
        let result = await adminProductHelpers.editProduct(req.body, productId);

        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getProductPage,
    getAddProductPage,
    addProduct,
    softDeleteProductMainImage,
    softDeleteProductDetailedImage,
    softDeleteProduct,
    undoSoftDeleteProduct,
    getEditProductPage,
    editProduct,
   }