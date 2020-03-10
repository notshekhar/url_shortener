let datastore = require("nedb")
let dotenv = require("dotenv")
dotenv.config()

let db = new datastore({ filename: process.env.URLS, corruptAlertThreshold: 1 })
db.loadDatabase(err => {
    if (err) console.log(err)
})

function shortURL(url, id, f) {
    db.insert(
        { id: id, url: url, shortURL: generateRandomString(), click: 0 },
        (err, newEntry) => {
            f(newEntry)
        }
    )
}
function getAllUrls(id, f) {
    db.find({ id: id }, (err, docs) => {
        f(docs)
    })
}
function getURL(shortURL, f) {
    db.find({ shortURL }, (err, data) => {
        if (err || data.length != 1) f({ fetch: false })
        else f({ src: data[0].url, fetch: true })
    })
}
function updateCount(shortURL, f) {
    db.find({ shortURL }, (e, d) => {
        if (d.length == 1) {
            let count = d[0].click + 1
            db.update(
                { shortURL },
                { shortURL, id: d[0].id, url: d[0].url, click: count }
            )
            f({count, id: d[0]["_id"]})
        } else {
            f({count: false})
        }
    })
}
function generateRandomString() {
    let length = Math.floor(Math.random() * (21 - 11) + 11)
    const v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    let output = ""
    for (let i = 0; i < length; i++) {
        output += v[Math.floor(Math.random() * v.length)]
    }
    return output
}

module.exports = {
    shortURL,
    getURL,
    getAllUrls,
    updateCount
}
