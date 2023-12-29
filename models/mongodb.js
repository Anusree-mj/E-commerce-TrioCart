require('dotenv').config()
const mongoosedb = require('mongoose');

mongoosedb.connect(process.env.mongo_url)
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed to connect');
    });

module.exports = mongoosedb;
