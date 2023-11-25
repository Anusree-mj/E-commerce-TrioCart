const collection = require('../routes/mongodb')
const bcrypt = require('bcrypt')
const signupUtil = require('../utils/signupUtil');
const delvryTimeUtil = require('../utils/delvryTymUtil');


module.exports = {
    doSignup: async (userData, otp) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email })
            if (user) {
                return { status: 'same email' }
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                const data = {
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    address: userData.address,
                    password: userData.password,
                    otp: otp
                }
                await collection.tempUsersCollection.insertMany([data])
                await signupUtil.sendOtpByEmail(userData.email, otp);
                return { status: 'ok' }
            }
        } catch (err) {
            console.log(err)
        }
    },

    doVerifyUser: async (data) => {
        try {
            const user = await collection.tempUsersCollection.findOne({ otp: data.otp });
            if (user) {
                const data = {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    address: user.address,
                    password: user.password
                }
                await collection.usersCollection.insertMany([data])
                return user
            }
        } catch (err) {
            console.log(err)
        }
    },

    dologin: async (userData) => {
        try {
            const user = await collection.usersCollection.findOne({ email: userData.email });
            if (user) {
                const passwordMatch = await bcrypt.compare(userData.password, user.password);
                if (passwordMatch) {
                    if (!user.isBlocked) {
                        return { user };
                    } else {
                        return { status: 'blocked' };
                    }
                } else {
                    return { status: 'invalid' };
                }
            } else {
                return { status: 'invalid' };
            }
        } catch (err) {
            console.log(err);
            return { status: 'error' };
        }
    },

    saveSessions: async (sessionId, userId) => {
        try {
            const data = {
                userId: userId,
                sessionId: sessionId
            }
            await collection.sessionCollection.insertMany([data])
            console.log('session stored')
        }
        catch (err) {
            console.log(err, 'session storing failed')
        }
    },

    checkSessions: async (sessionId) => {
        try {
            const checkSession = await collection.sessionCollection.findOne({
                sessionId: sessionId,
            }).populate('userId');

            if (checkSession) {
                let user = checkSession.userId;

                if (user && !user.isBlocked) {
                    return { status: 'ok', user }
                }
                else {
                    console.log('user is blocked')
                    return { status: 'nok' }
                }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
            return { status: 'nok' };
        }
    },

    deleteSessions: async (sessionId) => {
        try {
            await collection.sessionCollection.deleteOne({ sessionId: sessionId })
            return { status: 'deleted' }
        }
        catch (err) {
            console.log(err)
        }
    },

    getUser: async (email) => {
        try {
            const user = await collection.usersCollection.findOne({ email: email })
            return user
        }
        catch (err) {
            console.log(err)
        }
    },

    getOtp: async (email, otp) => {
        try {
            const user = await collection.tempUsersCollection.updateOne(
                { email: email },
                { $set: { otp: otp } }
            )
            if (user) {
                await signupUtil.sendOtpByEmail(email, otp)
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    verifyOtp: async (email, otp) => {
        try {
            const user = await collection.tempUsersCollection.findOne({ email: email, otp: otp });
            if (user) {
                return { user, status: "ok" }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    updatePassword: async (email, password) => {
        try {
            password = await bcrypt.hash(password, 10)
            const user = await collection.usersCollection.updateOne(
                { email: email },
                { $set: { password: password } })
            if (user) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    getCategoryDetails: async () => {
        try {
            const allCategories = await collection.categoryCollection.find()
            return allCategories
        }
        catch (err) {
            console.log(err)
        }
    },

    addToCart: async (user, productId, size) => {
        try {
            const existingProduct = await collection.cartCollection.findOne({
                userId: user._id,
                'products.product': productId,
                'products.Size': size,
            });

            if (existingProduct) {
                // If the product already exists, increment its count
                await collection.cartCollection.updateOne(
                    {
                        userId: user._id,
                        'products.product': productId,
                        'products.Size': size,
                    },
                    { $inc: { 'products.$.Count': 1 } }
                );
                console.log('Product count incremented');
            } else {
                // If the product doesn't exist, add it to the cart with a count of 1
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
            console.log('body in removal', body)
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
            } else {
                return { status: 'nok' };
            }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    saveBillingAddress: async (billingAddress) => {
        try {
            const updateData = await collection.usersCollection.updateOne(
                { _id: billingAddress.userId },
                {
                    $push: {
                        billingAddress: {
                            name: billingAddress.name,
                            phone: billingAddress.phone,
                            address: billingAddress.address,
                            town: billingAddress.town,
                            pincode: billingAddress.pincode,
                            state: billingAddress.state,
                        }
                    }
                })
            if (updateData.modifiedCount === 1) {
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                console.log('Data update failed')
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    saveOrderDetails: async (orderDetails) => {
        try {
            const getBillingAddress = await collection.usersCollection.findOne({
                _id: orderDetails.userId
            })
            const address = getBillingAddress.billingAddress[0];
            console.log('address in orders', address)
            // 
            const getOrderedProducts = await collection.cartCollection.findOne({
                userId: orderDetails.userId
            })
            const products = getOrderedProducts.products;


            const orderPlacementDate = new Date();
            const deliveryTym = delvryTimeUtil.calculateDeliveryEstimation(orderPlacementDate)

            const data = {
                userId: orderDetails.userId,

                billingAddress: [{
                    name: address.name,
                    phone: address.phone,
                    address: address.address,
                    town: address.town,
                    pincode: address.pincode,
                    state: address.state,
                }],

                products: products.map(product => ({
                    product: product.product,
                    Size: product.Size,
                    Count: product.Count,
                })),

                paymentMethod: orderDetails.paymentMethod,
                estimatedDelivery: deliveryTym,
                totalAmount: orderDetails.total,
            }
            console.log('inserted data in orders ', data)

            await collection.orderCollection.insertMany([data])
            await collection.cartCollection.deleteOne({
                userId: orderDetails.userId
            })
            return { status: 'ok' }

        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    getAllOrderDetails: async (userId) => {
        try {
            const orderDetails = await collection.orderCollection.find({
                userId: userId
            }).sort({ createdAt: -1 }).populate('products.product');
           
            const latestOrder = orderDetails[0];
            const estimatedDelivery = latestOrder.estimatedDelivery;

            return { status: 'ok', orderDetails, estimatedDelivery, latestOrder }

        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    getAnOrder: async (orderId) => {
        try {
            const order = await collection.orderCollection.findOne({
                _id: orderId
            }).populate('products.product');
            console.log('orderrrrrreeeee', order)
            console.log('sfsdfsdfdsfsfsdfsfs', order.products)
            return { order }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
}