const collection = require('../routes/mongodb')

module.exports = {
    dologin: async (adminData) => {
        try {
            const admin = await collection.adminCollection.findOne({ email: adminData.email })
            console.log(admin)
            if (admin && admin.password === adminData.password) {
                return admin
            } else {
                console.log('no admin')
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    
    saveSessions: async (sessionId, adminId) => {
        try {
            const data = {
                adminId: adminId,
                sessionId: sessionId
            }
            await collection.adminSessionCollection.insertMany([data])
            console.log('session stored')
        }
        catch (err) {
            console.log(err, 'session storing failed')
        }
    },

    checkSessions: async (sessionId) => {
        try {
            const check = await collection.adminSessionCollection.findOne({
                sessionId: sessionId,
            })
            if (check) {
                let adminId = check.adminId
                return { status: 'ok', adminId }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    deleteSessions: async (sessionId) => {
        try {
            await collection.adminSessionCollection.deleteOne({ sessionId: sessionId })
            return { status: 'deleted' }
        }
        catch (err) {
            console.log(err)
        }
    },

    getAdmin: async (email) => {
        try {
            const admin = await collection.adminCollection.findOne({ email: email })
            return admin
        }
        catch (err) {
            console.log(err)
        }
    },

    getUsers: async () => {
        try {
            const users = await collection.usersCollection.find()
            return users
        }
        catch (err) {
            console.log(err)
        }
    },

    blockOrUnblockUser: async (email, userStatus) => {
        try {
            const user = await collection.usersCollection.updateOne(
                { email: email },
                {
                    $set: { isBlocked: userStatus }
                })
            console.log(user)
            if (user.modifiedCount === 1) {
                console.log('Data update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log("error occured", err)
            return { status: 'nok' }
        }
    },
    getAllOrders : async ()=>{
        try {
            const orders = await collection.orderCollection
            .find()
            .populate('userId')
            .populate('products.product');           

            console.log('orders::',orders)

            return {orders}
        }
        catch (err) {
            console.log(err)
        }
    },
    updateOrderStatus : async (data)=>{
        try {
            const updateData = await collection.orderCollection.updateOne(
                { _id:data.orderId},
               { $set: {  orderStatus: data.status }}
                )                      

            if (updateData.modifiedCount === 1) {
                console.log('order update success')
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    getAnOrder: async (orderId) => {
        try {
            const order = await collection.orderCollection.findOne({
                _id: orderId
            }).populate('userId')
            .populate('products.product');
            
            return { order }
        } catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    }
}
