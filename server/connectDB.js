const mongoose = require("mongoose")
// import { createClient } from 'redis';

const connectMongoDB = () => {
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

// const connectRedis = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             const client = createClient();
//             client.on('error', err => console.log('Redis Client Error', err));
//             client.connect()
//                 .then(() => {
//                     console.log('Connected to Redis')
//                     resolve(client)
//                 })
//                 .catch(err => console.log('Failed to connect to Redis', err));
//         } catch (error) {
//             reject(error)
//         }
//     })
// }

module.exports = connectMongoDB