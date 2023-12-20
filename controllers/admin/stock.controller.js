const adminImgStockHelpers = require('../../helpers/admin/products/adminImgStock-helpers');
const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const productHelpers = require('../../helpers/user/product-helpers');

const getStockPage = async (req, res, next) => {
    try {
        let sessionId = req.cookies.adminSession;
        let result = await adminLoginHelpers.checkSessions(sessionId);

        if (result.status === 'ok') {
            let products = await productHelpers.getAllProducts();
            console.log('productsdetails', products[0]);
            res.render('admin/adminStock/stock', { layout: 'layout/layout', products });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
    }
};

const getEditProductStockPage = async (req, res, next) => {
    try {
        console.log('entered in get edit stock page');
        const productId = req.params.productId;
        const getSize = req.params.size;

        console.log('Product ID:', productId);
        let result = await adminImgStockHelpers.getProductStockForEditing(productId, getSize);

        if (result) {
            const { productData, size, count } = result;
            console.log('productdata in edit stock page', productData);
            res.render('admin/adminStock/editStockProduct', { productData, size, count });
        } else {
            res.redirect('/products');
        }
    } catch (error) {
        console.error(error);
    }
};

const editProductStock = async (req, res, next) => {
    try {
        const productId = req.params.product_Id;
        const { stock, size } = req.body;
        console.log('entered in edit stock');
        console.log('stockgottt:', stock, 'size:', size);

        let result = await adminImgStockHelpers.editStock(stock, size, productId);

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
    getStockPage,
    editProductStock,
    getEditProductStockPage
}