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
        console.log(req.body, "body")
        console.log("..................")
        if (!req.body.endpoint) {
            res.status(400).json({ message: "Endpoint should not be empty" })
            return
        }
        const existingSub = await Subscription.findOne({ endpoint: req.body.endpoint })
        if (existingSub) {
            res.json({ status: "Success", message: "Subscription already exists" })
            return
        }
        await Subscription.create({
            endpoint: req.body.endpoint,
            expirationTime: req.body.expirationTime,
            keys: req.body.keys
        })
        res.json({ status: "Success", message: "Subscription saved!.." })
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: "Error", message: "Failed to save subscription" })
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
