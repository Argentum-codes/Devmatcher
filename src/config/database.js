const mongoose = require('mongoose');;

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://ArghaGuha:k1nnd9X8m3gHkx8J@cluster0.iqxys2j.mongodb.net/devMatcher"
    );//returns a promise //connecting to the clustor
}

module.exports = connectDB;

