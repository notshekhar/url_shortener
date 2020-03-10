let datastore = require("nedb")
let dotenv = require("dotenv")
dotenv.config()

let { getDetails } = require("./basic.js")

let db = new datastore({
    filename: process.env.REQUESTS,
    corruptAlertThreshold: 1
})
db.loadDatabase(err => {
    if (err) console.log(err)
})
