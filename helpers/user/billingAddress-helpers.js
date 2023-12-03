const collection = require('../../models')

module.exports = {    
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

    getBillingAddress: async (addressId) => {
        try {
            const address = await collection.usersCollection.findOne(
                { 'billingAddress._id': addressId },
                { 'billingAddress.$': 1 }
            );
            console.log('adress', address)
            return { address }
        }
        catch (err) {
            console.log(err);
            return { status: 'nok' };
        }
    },

    deleteBillingAddress: async (addressId,userId) => {
        try {           
            const updateData = await collection.usersCollection.updateOne(
                {_id:userId},
                { $pull: { billingAddress: { _id: addressId } } }

            ); if (updateData.modifiedCount === 1) {
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

    updateBillingAddress: async (billingAddress) => {
        try {
            console.log('editingid', billingAddress.editedAddressId)
            const updateData = await collection.usersCollection.updateOne(
                { 'billingAddress._id': billingAddress.editedAddressId },
                {
                    $set: {
                        'billingAddress.$': {
                            name: billingAddress.name,
                            phone: billingAddress.phone,
                            address: billingAddress.address,
                            town: billingAddress.town,
                            pincode: billingAddress.pincode,
                            state: billingAddress.state,
                        }
                    }
                }
            );

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
}
