const express = require("express")
const cors = require("cors")
const webpush = require("web-push")
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
            "https://nf-ui-matdag.netlify.app"
        ]
    }
))
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hellow")
})

let subDB = []

app.post("/save-subscription", (req, res) => {
    try {
        console.log("Saving")
        subDB.push(req.body)
        res.json({ status: "Success", message: "Subscription saved!" })
    } catch (error) {
        console.log(error)
    }
})

app.get("/db", (req, res) => {
    console.log(subDB)
    res.json(subDB)
})
app.get("/clear-db",(req,res)=>{
    subDB = []
    res.json({message:"db cleared"})
})

app.get('/send-notification', (req, res) => {
    try {
        console.log("Sending Notification")
        webpush.sendNotification(subDB[0], "Notification body from server")
        res.json({ status: "Success", message: "Message sent to push service" })
    } catch (error) {
        console.log(error)
    }
})


app.listen(port, () => {
    console.log("Server running on port 3000")
})