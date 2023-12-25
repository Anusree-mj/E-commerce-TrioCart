const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');

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

        // pagination

        const page = parseInt(req.query.page) || 1;
        const productsPerPage = 20;
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = page * productsPerPage;

        const paginatedProducts = products.slice(startIndex, endIndex);
        const totalPages = Math.ceil(products.length / productsPerPage);
        const currentPage = page; 

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
                    products: paginatedProducts,
                    categories,
                    user,
                    totalCartProduct,
                    totalPages,
                    currentPage,
                });
            }
        } else {
            res.render('customers/products/categoryProducts', {
                layout: 'layout/layout',
                allCategories,
                category,
                searchProducts,
                products: paginatedProducts,
                categories,
                user: undefined,
                totalPages,
                currentPage
            });
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getCategoryProductsPage,
}