const collection = require('../../../models/index-model')

module.exports = {
    getAllCashbacks: async () => {
        try {
            const cashbacks = await collection.cashBackCollection.find().sort({ createdAt: -1 });

            return cashbacks
        } catch (err) {
            console.log(err)
        }
    },
    getACashBackForEdit: async (cashbackId) => {
        try {
            const cashback = await collection.cashBackCollection.find(
                { _id: cashbackId }
            )
            return cashback
        } catch (err) {
            console.log(err)
        }
    },
    editCashback: async (cashbackId, data) => {
        try {
            const updateCashback = await collection.cashBackCollection.findOneAndUpdate(
                { _id: cashbackId },
                { $set: { cashBack: data.newCashback } }
            )
            if (updateCashback) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }

        } catch (err) {
            console.log(err)
        }
    },
   deleteCashback: async (cashbackId) => {
        try {
            const updateCashback = await collection.cashBackCollection.findOneAndUpdate(
                { _id: cashbackId },
                { $set: { isValid: false } }
            )
            if (updateCashback) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }

        } catch (err) {
            console.log(err)
        }
    },
   undodeleteCashback: async (cashbackId) => {
        try {
            const updateCashback = await collection.cashBackCollection.findOneAndUpdate(
                { _id: cashbackId },
                { $set: { isValid: true } }
            )
            if (updateCashback) {
                return { status: 'ok' }
            } else {
                return { status: 'nok' }
            }

        } catch (err) {
            console.log(err)
        }
    },
}