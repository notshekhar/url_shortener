let datastore = require("nedb")
let dotenv = require("dotenv")
dotenv.config()

let { getDetails } = require("./basic.js")

let db = new datastore({
    filename: process.env.REQUESTS,
    corruptAlertThreshold: 1,
    autoload: true
})
// db.loadDatabase(err => {
//     if (err) console.log(err)
// })

function saveRequest(req, type, f) {
    let d = getDetails(req, type)
    db.insert(d, (err, newEntry)=>{
        f(newEntry)
    })
}

module.exports = { saveRequest }
