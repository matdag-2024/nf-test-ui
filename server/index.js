const express = require("express")
const cors = require("cors")
const webpush = require("web-push")
const port = 3000
const app = express()

const apiKeys = {
        publicKey : "BCTrWHRejIZgIzrsBob9CdszCoBhq0oylzFvjJ9_ZV2iIg15Rrb2c4UgRkH7_Jqt18-NIzW8htgyfOMT3JzppKQ",
        privateKey : "v3DUPzYyQD7FXN-_hTGZjr7DXCvILmaGgJyMy-2kZFk"
}

webpush.setVapidDetails(
    "mailto:shabeebmongam@gmail.com",
    apiKeys.publicKey,
    apiKeys.privateKey
)

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Hellow")
})

const subDB = []

app.post("/save-subscription", (req, res) => {
    subDB.push(req.body)
    res.json({ status: "Success", message: "Subscription saved!" })
})

app.get('/send-notification',(req,res)=>{
    webpush.sendNotification(subDB[0],"Heeeeeeeeeeeeeeeeee")
    res.json({status:"Success", message:"Message sent to push service"})
})


app.listen(port, () => {
    console.log("Server running on port 3000")
})