const adminImgStockHelpers = require('../../helpers/admin/products/adminImgStock-helpers');
const adminLoginHelpers = require('../../helpers/admin/login/adminLogin-helpers');
const productHelpers = require('../../helpers/user/product-helpers')

const getStockPage = (req, res, next) => {
    let sessionId = req.cookies.adminSession
    adminLoginHelpers.checkSessions(sessionId).then(result => {
        if (result.status === 'ok') {
            productHelpers.getAllProducts().then((products) => {
                console.log('productsdetails',products[0])
                res.render('admin/adminStock/stock', { layout: 'layout/layout', products });
            })
        }
        else {
            res.redirect('/admin');
        }
    })
}

const getEditProductStockPage = (req, res, next) => {
    console.log('entered in get edit stock page')
    const productId = req.params.productId;
       const getSize = req.params.size;

    console.log('Product ID:', productId);
    adminImgStockHelpers.getProductStockForEditing(productId,getSize).then((result) => {
        if (result) {
            const {productData,size,count}= result;
            console.log('productdata in edit stock page',productData)
            res.render('admin/adminStock/editStockProduct', { productData,size,count })
        } else {
            res.redirect('/products');
        }
    })
}

const editProductStock = (req, res, next) => {
    const productId = req.params.product_Id
    const{stock,size}=req.body;
    console.log('entered in edit stock')
    console.log('stockgottt:',stock,'size:',size)
    adminImgStockHelpers.editStock(stock,size, productId).then((result) => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        } else {
            res.status(500).json({ status: "nok" });
        }
    })
}

module.exports = {
    getStockPage,
    editProductStock,
    getEditProductStockPage
}