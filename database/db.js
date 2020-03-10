let datastore = require("nedb")
let dotenv = require("dotenv")
dotenv.config()

let db = {
    auth: new datastore({
        filename: "users.db",
        corruptAlertThreshold: 1,
        autoload: true
    }),
    urls: new datastore({
        filename: "urls.db",
        corruptAlertThreshold: 1,
        autoload: true
    }),
    requests: new datastore({
        filename: "requests.db",
        corruptAlertThreshold: 1,
        autoload: true
    })
}
function users() {
    db.auth.find({}, (err, docs) => {
        console.log(docs, docs.length)
    })
}
function urls() {
    db.urls.find({}, (err, docs) => {
        console.log(docs, docs.length)
    })
}
function requests() {
    db.requests.find({}, (err, docs) => {
        console.log(docs, docs.length)
    })
}
let option = process.argv[2]
if (option) {
    switch (option) {
        case "users":
            users()
            break
        case "urls":
            urls()
            break
        case "reqs":
            requests()
            break
        default:
            console.log("Invalid selection")
    }
} else {
    console.log("please try: users, urls, requests")
}
