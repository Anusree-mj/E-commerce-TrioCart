const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const productQueryHelpers = require('../../../helpers/user/products/productQuery-helpers')
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');

const searchProduct = async (req, res, next) => {
    try {
        let allCategories = await categoryHelpers.getCategoryDetails();
        let query = req.query.q;
        let sessionId = req.cookies.session;

        let sessionResult = await sessionHelpers.checkSessions(sessionId);
        const isAuthenticated = sessionResult.status === 'ok';
        let productQueryResult = await productQueryHelpers.getSearchProduct(query);
        let searchProducts = productQueryResult.searchProducts;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const productsPerPage = 16;
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = page * productsPerPage;

        const paginatedSearchProducts = searchProducts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(searchProducts.length / productsPerPage);
        const currentPage = page;

        if (productQueryResult.status === 'ok') {
            if (isAuthenticated) {
                let user = sessionResult.user;
                let userId = user._id;

                let cartResult = await cartHelpers.getMyCartProducts(userId);

                if (cartResult) {
                    let totalCartProduct = cartResult.totalCount;
                    res.render('customers/search', {
                        layout: 'layout/layout',
                        allCategories,
                        user,
                        totalCartProduct,
                        searchProducts: paginatedSearchProducts,
                        totalPages,
                        currentPage,
                    });
                } else {
                    res.render('customers/search', {
                        layout: 'layout/layout',
                        allCategories,
                        user,
                        searchProducts: paginatedSearchProducts,
                        totalPages,
                        currentPage,
                    });
                }
            } else {
                res.render('customers/search', {
                    layout: 'layout/layout',
                    allCategories,
                    user: undefined,
                    searchProducts: paginatedSearchProducts,
                    totalPages,
                    currentPage,
                });
            }
        } else {
            res.render('customers/search', {
                layout: 'layout/layout',
                allCategories,
                user: undefined,
                searchProducts: undefined,
                totalPages,
                currentPage,
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchProduct
}