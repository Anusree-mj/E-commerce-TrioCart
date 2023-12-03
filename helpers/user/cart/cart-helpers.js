const collection = require('../../../models/mongodb')

module.exports = {
    cartProductIncrement: async (productId, size) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $inc: { stock: -1 } }
            )
            const updateData = await collection.cartCollection.updateOne(
                {
                    'products.product': productId,
                    'products.Size': size,
                },
                { $inc: { 'products.$.Count': 1 } }
            );
            if (updateData.modifiedCount === 1) {
                console.log('Data update success');
                return { status: 'ok' }
            } else {
                console.log('Data update failed');
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
        }
    },

    cartProductDecremnt: async (productId, size) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $inc: { stock: +1 } }
            )
            const updateData = await collection.cartCollection.updateOne(
                {
                    'products.product': productId,
                    'products.Size': size,
                },
                { $inc: { 'products.$.Count': -1 } }
            );
            if (updateData.modifiedCount === 1) {
                console.log('Data update success');
                return { status: 'ok' }
            } else {
                console.log('Data update failed');
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
        }
    },

    addToCart: async (user, productId, size) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $inc: { stock: -1 } }
            )
            const existingProduct = await collection.cartCollection.findOne({
                userId: user._id,
                'products.product': productId,
                'products.Size': size,
            });

            if (existingProduct) {
                await collection.cartCollection.updateOne(
                    {
                        userId: user._id,
                        'products.product': productId,
                        'products.Size': size,
                    },
                    { $inc: { 'products.$.Count': 1 } }
                );
                console.log('Product count incremented');
            }
            else {
                const updateData = await collection.cartCollection.updateOne(
                    { userId: user._id },
                    {
                        $addToSet: {
                            products: {
                                product: productId,
                                Size: size,
                            },
                        },
                    },
                    { upsert: true }
                );

                if (updateData.modifiedCount === 1 || updateData.upsertedCount === 1) {
                    console.log('Data update success');
                } else {
                    console.log('Data update failed');
                }
            }
        } catch (err) {
            console.log(err);
        }
    },

    getMyCartProducts: async (user) => {
        try {
            const cart = await collection.cartCollection.findOne({ userId: user._id })
                .populate('products.product');

            if (cart && cart.products) {

                let cartProducts = cart.products;
                totalCount = cart.products.length

                let totalprice = cartProducts.reduce((sum, item) => {
                    return sum + (item.product.price * item.Count)
                }, 0)


                return { cartProducts, totalCount, totalprice };
            } else {
                return { totalCount: 0, totalPrice: 0 };
            }
        } catch (err) {
            console.log(err);
        }
    },

    removeCartProducts: async (productId, body) => {
        try {
            await collection.productsCollection.updateOne(
                { _id: productId },
                { $inc: { stock: body.count } }
            )
            const updateData = await collection.cartCollection.updateOne(
                { userId: body.userId },
                { $pull: { products: { product: productId, Size: body.size } } }
            );

            if (updateData.modifiedCount === 1) {
                console.log('Data update success');

                const updatedCart = await collection.cartCollection.findOne({ userId: body.userId });
                if (updatedCart.products.length < 1) {
                    await collection.cartCollection.deleteOne({ userId: body.userId });
                    console.log('Cart document deleted');
                }
                return { status: 'ok' };
            }
            else {
                return { status: 'nok' };
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

}