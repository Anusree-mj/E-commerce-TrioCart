const productHelpers = require('../../helpers/user/product-helpers')
const sessionHelpers = require('../../helpers/user/session-helpers');
const categoryHelpers = require('../../helpers/user/category-helpers');
const cartHelpers = require('../../helpers/user/cart-helpers');

const getCartPage = async (req, res, next) => {
    let allCategories = await categoryHelpers.getCategoryDetails()

    productHelpers.getNewArrivalProducts().then(result => {
        let viewMoreProducts = [...result.category1, ...result.category2, ...result.category3, ...result.category4];
        let sessionId = req.cookies.session

        sessionHelpers.checkSessions(sessionId).then((result) => {
            if (result.status === 'ok') {
                let user = result.user

                cartHelpers.getMyCartProducts(user).then((result) => {
                    if (result) {
                       const {cartProducts,totalCount,totalprice}=result
                        res.render('users/cart', {
                            layout: 'layout/layout', allCategories, viewMoreProducts, user, cartProducts, totalprice,
                            totalCartProduct:totalCount
                        });
                    }
                    else {
                        res.render('users/cart', {
                            layout: 'layout/layout', allCategories, viewMoreProducts, user,
                            cartProducts: undefined, totalCartProduct: undefined, totalPrice: undefined
                        });
                    }
                })
            }
            else {
                res.redirect('/user/login')
            }
        });
    })
}

const addProductToCart = (req, res, next) => {
    let productId = req.params.product_id
    let size = req.body.choosedSize
    let sessionId = req.cookies.session

    sessionHelpers.checkSessions(sessionId).then((result) => {
        if (result.status === 'ok') {
            let user = result.user

            cartHelpers.addToCart(user, productId, size).then((result) => {
                if(result.status==='ok'){
                    res.status(200).json({ status: "ok" });
                }else{
                    res.status(200).json({ status: "outofStock" });
                }
                
            })
        }
        else {
            res.status(400).json({ status: "nok" });
        }
    })
}

const removeProductFromCart = (req, res, next) => {
    let productId = req.params.product_id
    let body = req.body

    cartHelpers.removeCartProducts(productId, body).then(result => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }
        else {
            res.status(400).json({ status: "nok" });
        }
    })
}


const addProductCount = (req, res, next) => {
    let productId = req.params.product_id
    let size = req.body.size
    cartHelpers.cartProductIncrement(productId, size).then(result => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }
        else {
            res.status(400).json({ status: "nok" });
        }
    })
}

const decreaseProductCount = (req, res, next) => {
    let productId = req.params.product_id
    let size = req.body.size
    cartHelpers.cartProductDecremnt(productId, size).then(result => {
        if (result.status === 'ok') {
            res.status(200).json({ status: "ok" });
        }
        else {
            res.status(400).json({ status: "nok" });
        }
    })
}

module.exports = {
    getCartPage,
    addProductToCart,
    removeProductFromCart,
    addProductCount,
    decreaseProductCount
}