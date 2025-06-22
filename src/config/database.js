const mongoose = require('mongoose');;

const connectDB = async () => {
    await mongoose.connect(
        process.env.DB_CONNECTION_SECRET
    );//returns a promise //connecting to the clustor
}

module.exports = connectDB;

