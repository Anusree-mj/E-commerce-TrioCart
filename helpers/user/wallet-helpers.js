const collection = require('../../models/index-model')

module.exports = {
    getWalletDetails: async (userId) => {
        try {
            const walletDetails = await collection.walletCollection.find({
                userId: userId
            })

            if (walletDetails) {
                return { status: 'ok', walletDetails }
            } else {
                console.log('no wallet ')
                return { status: 'nok' }
            }
        } catch (err) {
            console.log(err);
        }
    },
}