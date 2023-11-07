const collection = require('../routes/mongodb')
module.exports = {
    addProduct: async (body, image) => {
        try {
            console.log(body);
            console.log("pathpathpathpathpathpathpath :" + image.path)
            const data = {
                name: body.name,
                description: body.description,
                category: body.category,
                subCategory: body.subCategory,
                price: body.price,
                size: body.size,
                image: image.path
            };
            await collection.productsCollection.insertMany([data]);
            return { status: 'ok' }
        } catch (err) {
            console.log(err);
            return { status: 'nok' }
        }
    },
    getAllProducts: async () => {
        try {
            const products = await collection.productsCollection.find()
            console.log("productsproductsproductsproductsproducts", products)
            return (products)
        }
        catch (err) {
            console.log(err)
        }
    }
}






