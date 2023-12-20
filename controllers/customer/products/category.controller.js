const categoryHelpers = require('../../../helpers/user/category-helpers');
const sessionHelpers = require('../../../helpers/user/session-helpers');
const cartHelpers = require('../../../helpers/user/cart-helpers');


const getCategoryProductsPage = async (req, res, next) => {
    try {
        const category = req.params.category;
        let allCategories = await categoryHelpers.getCategoryDetails();
        let query = req.query.q;
        let size = req.query.size;
        let price = req.query.price;

        let result = await categoryHelpers.viewAllProductsofEAchCAtegory(category, query, size, price);
        let products = result.products;
        let categories = result.categories;
        let searchProducts = result.searchProducts;
        let sessionId = req.cookies.session;

        let sessionResult = await sessionHelpers.checkSessions(sessionId);
        const isAuthenticated = sessionResult.status === 'ok';

        if (isAuthenticated) {
            let user = sessionResult.user;
            let userId = user._id;

            let cartResult = await cartHelpers.getMyCartProducts(userId);

            if (cartResult) {
                let totalCartProduct = cartResult.totalCount;
                res.render('customers/products/categoryProducts', {
                    layout: 'layout/layout',
                    allCategories,
                    category,
                    searchProducts,
                    products,
                    categories,
                    user,
                    totalCartProduct
                });
            }
        } else {
            res.render('customers/products/categoryProducts', {
                layout: 'layout/layout',
                allCategories,
                category,
                searchProducts,
                products,
                categories,
                user: undefined
            });
        }
    } catch (error) {       
        console.error(error);        
    }
};


module.exports = {
    getCategoryProductsPage,
}