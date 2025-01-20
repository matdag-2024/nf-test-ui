const express = require("express")
const cors = require("cors")
const webpush = require("web-push")
const Subscription = require("./schema/subscription.model")
const connectMongoDB = require("./connectDB")
const port = 3000
const app = express()

const apiKeys = {
    publicKey: "BCTrWHRejIZgIzrsBob9CdszCoBhq0oylzFvjJ9_ZV2iIg15Rrb2c4UgRkH7_Jqt18-NIzW8htgyfOMT3JzppKQ",
    privateKey: "v3DUPzYyQD7FXN-_hTGZjr7DXCvILmaGgJyMy-2kZFk"
}

webpush.setVapidDetails(
    "mailto:shabeebmongam@gmail.com",
    apiKeys.publicKey,
    apiKeys.privateKey
)

app.use(cors(
    {
        origin: [
            "https://nf-ui-matdag.netlify.app",
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        ]
    }
))
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hellow")
})

let subDB = []

app.post("/save-subscription", async (req, res) => {
    try {
        console.log("Saving")
        console.log(req.body,"body")
        const newSub = await Subscription.create({
            endpoint: req.body.endpoint,
            expirationTime: req.body.expirationTime,
            keys: req.body.keys
        }, { new: true })
        // console.log(newSub)
        res.json({ status: "Success", message: "Subscription saved!.." })
    } catch (error) {
        console.log(error)
    }
})

app.get("/db", async (req, res) => {
    const subs = await Subscription.find({})
    res.json(subs)
})
app.get("/clear-db", (req, res) => {
    subDB = []
    res.json({ message: "db cleared" })
})

app.get('/send-notification/:index', async (req, res) => {
    try {
        if (!req.params.index) {
            res.json({ message: "No index" })
            return
        }
        const clients = await Subscription.find({})
        const rawClinet = clients[req.params.index]
        const client = {
            endpoint: rawClinet.endpoint,
            expirationTime: rawClinet.expirationTime,
            keys: rawClinet.keys
        }
        console.log("Sending Notification")
        webpush.sendNotification(client, "Notification body from server")
        res.json({ status: "Success", message: "Message sent to push service" })
    } catch (error) {
        console.log(error)
    }
})

const startServer = async () => {
    await connectMongoDB()
    app.listen(port, () => {
        console.log("Server running on port 3000")
    })
}

startServer()
