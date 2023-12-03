
const mongoosedb = require('./mongodb');
// admin collection
const AdminCollection = new mongoosedb.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const adminCollection = new mongoosedb.model("admins", AdminCollection)


module. exports= adminCollection