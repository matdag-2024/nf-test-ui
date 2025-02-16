const mongoose = require("mongoose")

const keySchema = mongoose.Schema({
    p256dh: {
        type: String
    },
    auth: {
        type: String
    }

}, {
    _id: false
})

const subSchema = mongoose.Schema({
    endpoint: {
        type: String,
        require: true
    },
    expirationTime: { type: String },
    keys: {
        type: keySchema
    }
})


const Subscription = mongoose.model("subs", subSchema)

module.exports = Subscription