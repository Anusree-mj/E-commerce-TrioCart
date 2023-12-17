const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const adminProductHelpers = require('../../helpers/admin/products/adminProduct-helpers');
const adminImgStockHelpers = require('../../helpers/admin/products/adminImgStock-helpers');
const productHelpers = require('../../helpers/user/product-helpers')

const getProductPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession;
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            productHelpers.getAllProducts().then((products) => {
                res.render('admin/adminProducts/products/adminProducts', { layout: 'layout/layout', products });
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const getAddProductPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            res.render('admin/adminProducts/productUpdates/addProduct', { layout: 'layout/layout' })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const addProduct = (req, res, next) => {
    adminProductHelpers.addProduct(req.body).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const softDeleteProductMainImage = (req, res, next) => {
    const productId = req.body.productId
    adminImgStockHelpers.deleteMainImage(productId).then((result) => {
        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const softDeleteProductDetailedImage = (req, res, next) => {
    const image = req.body.image
    const productId = req.body.productId
    console.log('image id in delet router:', image);
    console.log('product id in delet router:', productId);
    adminImgStockHelpers.deleteAProductImage(image, productId).then((result) => {
        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const softDeleteProduct = (req, res, next) => {
    const productId = req.params.product_Id
    adminProductHelpers.deleteAProduct(productId).then((result) => {
        if (result.status === 'deleted') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const undoSoftDeleteProduct = (req, res, next) => {
    const productId = req.params.product_id
    adminProductHelpers.undoProductDelete(productId).then((result) => {
        if (result.status === 'undo delete') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

const getEditProductPage = (req, res, next) => {
    const productId = req.params.product_Id
    console.log('Product ID:', productId);
    adminProductHelpers.getProductForEditing(productId).then((productData) => {
        if (productData) {
            res.render('admin/adminProducts/productUpdates/editProduct', { productData })
        } else {
            res.redirect('/products');
        }
    })
}

const editProduct = (req, res, next) => {
    const productId = req.params.product_Id
    adminProductHelpers.editProduct(req.body, productId).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}


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