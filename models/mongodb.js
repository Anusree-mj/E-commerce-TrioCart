
const mongoosedb = require('mongoose');

mongoosedb.connect("mongodb://localhost:27017/TrioCart")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed to connect');
    });

module.exports = mongoosedb
