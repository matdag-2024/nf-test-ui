const mongoose = require("mongoose")


const connectDB = () => {
    return new Promise((resolve, reject) => {
        try {
            const db = mongoose.connect("mongodb+srv://forvoosh:passpass@cluster0.fbmnedq.mongodb.net/")
            mongoose.connection.on("open", () => {
                console.log("connected to db")
                resolve(db)
            })
            mongoose.connection.on("error", (error) => {
                reject(error)
            })
        } catch (error) {
            reject(error)
        }
    })

}

module.exports = connectDB