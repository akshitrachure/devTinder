const mongoose = require('mongoose')

const connectDB = async () => {
    const url = "mongodb+srv://rachureakshit1899:hu3yH6gNAxz5TZ5y@namastenode.q60g2.mongodb.net/devTinder"
    mongoose.connect(url)
}

module.exports = connectDB;

