const productHelpers = require('../../../helpers/user/products/product-helpers');
const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');


const getProductDetailPage = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        let allCategories = await categoryHelpers.getCategoryDetails();

        let productResult = await productHelpers.getAproduct(productId);
        let product = productResult;
        let category = product.category;
        let subCategory = product.subCategory;

        let subcategoryProductsResult = await categoryHelpers.viewEachSubcategoryProducts(category, subCategory);
        let viewMoreProducts = subcategoryProductsResult.products;
        let sessionId = req.cookies.session;

        let sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            let user = sessionResult.user;
            let userId = user._id;

            let cartResult = await cartHelpers.getMyCartProducts(userId);

            if (cartResult) {
                let totalCartProduct = cartResult.totalCount;
                res.render('customers/products/productDetails', {
                    layout: 'layout/layout',
                    allCategories,
                    viewMoreProducts,
                    product,
                    user,
                    totalCartProduct
                });
            }
        } else {
            res.render('customers/products/productDetails', {
                layout: 'layout/layout',
                allCategories,
                viewMoreProducts,
                product,
                user: undefined
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductDetailPage,
}