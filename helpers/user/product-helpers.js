const collection = require('../../models/index-model')

module.exports = {
    getAllProducts: async () => {
        try {
            const products = await collection.productsCollection.find().sort({ createdAt: -1 });
            return (products)
        }
        catch (err) {  
            console.log(err)
        }
    },   

    getNewArrivalProducts: async () => {
        try {
            const category1 = await collection.productsCollection.find({ category: "Ladies", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            const category2 = await collection.productsCollection.find({ category: "Mens", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            const category3 = await collection.productsCollection.find({ category: "Kids", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            const category4 = await collection.productsCollection.find({ category: "Girls", isDeleted: false }).limit(4).sort({ createdAt: -1 });
            return { category1, category2, category3, category4 }
        }
        catch (err) {
            console.log(err)
        }
    },   

    getAproduct: async (productId) => {
        try {
            const product = await collection.productsCollection.findOne({ _id: productId })
            return product
        } catch (err) {
            console.log(err)
        }
    },
   
}







