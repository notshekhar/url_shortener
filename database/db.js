let datastore = require("nedb")
let dotenv = require("dotenv")
dotenv.config()

let db = {
    auth: new datastore({
        filename: process.env.USERS,
        corruptAlertThreshold: 1,
        autoload: true
    }),
    urls: new datastore({
        filename: process.env.URLS,
        corruptAlertThreshold: 1,
        autoload: true
    }),
    requests: new datastore({
        filename: process.env.REQUESTS,
        corruptAlertThreshold: 1,
        autoload: true
    })
}

