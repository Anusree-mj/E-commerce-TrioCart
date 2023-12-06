const collection = require('../../models/index-model')

module.exports = {
    getCategoryDetails: async () => {
        try {
            const allCategories = await collection.categoryCollection.find()
            return allCategories
        }
        catch (err) {
            console.log(err)
        }
    },
    
viewEachSubcategoryProducts: async (category, subcategory, query, size, price) => {
    try {
        let categories;
        let products;
        if (!query && !size && !price) {
            categories = await collection.categoryCollection.findOne({ category: category })
            products = await collection.productsCollection.find({ category: category, subCategory: subcategory, isDeleted: false }).sort({ createdAt: -1 });
            return { categories, products }

        } else if (query && query === 'lowestToHighest' && !size && !price) {
                        categories = await collection.categoryCollection.findOne({
                category: category
            })

            products = await collection.productsCollection.find({
                category: category, subCategory: subcategory, isDeleted: false
            }).sort({ price: 1 });

            return { categories, products }

        } else if (query && query === 'highestToLowest' && !size && !price) {
            categories = await collection.categoryCollection.findOne({
                category: category
            })

            products = await collection.productsCollection.find({
                category: category, subCategory: subcategory, isDeleted: false
            }).sort({ price: -1 });

            return { categories, products }
        }
        else if (size && !query && !price) {
            categories = await collection.categoryCollection.findOne({
                category: category
            })
           console.log('categories',category,subcategory,size)
            products = await collection.productsCollection.find(
                {
                    category: category,
                    subCategory: subcategory,
                    isDeleted: false,
                    size: { $regex: new RegExp(size, 'i') }
                })
console.log('products312321',products)
            return { categories, products }
        } else if (!size && !query && price) {
            categories = await collection.categoryCollection.findOne({
                category: category
            })

            products = await collection.productsCollection.find(
                {
                    category: category,
                    subCategory: subcategory,
                    isDeleted: false,
                    price: { $lte: price }

                }).sort({ createdAt: -1 });

            return { categories, products }
        } else if (size && price && !query) {
            console.log('size price', size, price)
            categories = await collection.categoryCollection.findOne({
                category: category
            })

            products = await collection.productsCollection.find(
                {
                    category: category,
                    subCategory: subcategory,
                    isDeleted: false,
                    size: { $regex: new RegExp(size, 'i') },
                    price: { $lte: price }

                }).sort({ createdAt: -1 });
            console.log('productssss', products)
            return { categories, products }
        }

    }
    catch (err) {
        console.log(err)
    }
},

viewAllProductsofEAchCAtegory: async (category, query) => {
    try {
        console.log('queryinfnct', query)
        let products;
        let categories;

        if (!query) {
            products = await collection.productsCollection.find(
                { category: category, isDeleted: false }).sort({ createdAt: -1 });

            categories = await collection.categoryCollection.findOne({ category: category })
            return { products, categories }

        } else if (query && query === 'lowestToHighest') {
            products = await collection.productsCollection.find(
                { category: category, isDeleted: false }).sort({ price: 1 });

            categories = await collection.categoryCollection.findOne({ category: category })
            return { products, categories }

        } else if (query && query === 'highestToLowest') {
            products = await collection.productsCollection.find(
                { category: category, isDeleted: false }).sort({ price: -1 });

            categories = await collection.categoryCollection.findOne({ category: category })
            return { products, categories }

        }

        return { products, categories }
    }
    catch (err) {
        console.log(err)
    }
},

}