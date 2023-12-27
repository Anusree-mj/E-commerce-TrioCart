const categoryHelpers = require('../../../helpers/user/products/category-helpers');
const sessionHelpers = require('../../../helpers/user/userHelpers/session-helpers');
const cartHelpers = require('../../../helpers/user/c&c/cart-helpers');

const getsubcategoryProductsPage = async (req, res, next) => {
    try {
        const category = req.params.category;
        const subCategory = req.params.subcategory;
        let query = req.query.q;
        let size = req.query.size;
        let price = req.query.price;

        let allCategories = await categoryHelpers.getCategoryDetails();

        let result = await categoryHelpers.viewEachSubcategoryProducts(category, subCategory, query, size, price);
        let categories = result.categories;
        let products = result.products;
        let sessionId = req.cookies.session;
            //  pagination
            const page = parseInt(req.query.page) || 1;
            const productsPerPage = 16;
            const startIndex = (page - 1) * productsPerPage;
            const endIndex = page * productsPerPage;

            const paginatedProducts = products.slice(startIndex, endIndex);
            const totalPages = Math.ceil(products.length / productsPerPage);
            const currentPage = page;
        let sessionResult = await sessionHelpers.checkSessions(sessionId);

        if (sessionResult.status === 'ok') {
            let user = sessionResult.user;
            let userId = user._id;

            let cartResult = await cartHelpers.getMyCartProducts(userId);

            if (cartResult) {
                let totalCartProduct = cartResult.totalCount;
                res.render('customers/products/subCategoryProducts', {
                    layout: 'layout/layout',
                    allCategories,
                    category,
                    subCategory,
                    categories,
                    products: paginatedProducts,
                    user,
                    totalCartProduct,
                    totalPages,
                    currentPage
                });
            }
        } else {
            res.render('customers/products/subCategoryProducts', {
                layout: 'layout/layout',
                allCategories,
                category,
                subCategory,
                categories,
                products: paginatedProducts,
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
    getsubcategoryProductsPage,
}