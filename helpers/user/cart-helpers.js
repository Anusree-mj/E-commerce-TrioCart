const collection = require('../../models/index-model')
const stockHelpers = require('./stock-helpers');

module.exports = {
    cartProductIncrement: async (productId, size) => {
        try {

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
            const checkStockAvailability = await stockHelpers.checkStock(productId, size);
            if (checkStockAvailability.status === 'available') {

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
                    return { status: 'ok' }
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
                        return { status: 'ok' }
                    } else {
                        console.log('Data update failed');
                    }
                }
            }
            else {
                console.log('out of stock');
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
        }
    },

    getMyCartProducts: async (user) => {
        try {
            let stockAvailability = true;
            const cart = await collection.cartCollection.findOne({ userId: user._id })
                .populate('products.product');

            if (cart && cart.products) {

                let cartProducts = cart.products;
                console.log('cart prosud', cartProducts)
                totalCount = cart.products.length

                await Promise.all(cartProducts.map(async (cartProduct) => {
                    const { product, Size } = cartProduct;
                    const productId = product._id;
                    const checkStockAvailability = await stockHelpers.checkStock(productId, Size);
                    cartProduct.set({ stock: checkStockAvailability.status });
                    if (checkStockAvailability.status === 'out of stock') {
                        stockAvailability = false;
                    }

                }));

                console.log('cartProducts Updated', cartProducts);

                let totalprice = cartProducts.reduce((sum, item) => {
                    return sum + (item.product.price * item.Count)
                }, 0)

                return { cartProducts, totalCount, totalprice, stockAvailability };
            } else {
                return { totalCount: 0, totalPrice: 0 };
            }
        } catch (err) {
            console.log(err);
        }
    },

    removeCartProducts: async (productId, body) => {
        try {
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