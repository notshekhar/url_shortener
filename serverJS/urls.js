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
function getURL(shortURL, id, f) {
    db.find({ shortURL, id }, (err, data) => {
        if (err || data.length != 1) f({ fetch: false })
        else f({ src: data[0].url, fetch: true })
    })
}
function updateCount(shortURL, id, f) {
    db.find({ shortURL, id }, (e, d) => {
        if(d.length == 1){
            let count = d[0].click + 1
            db.update({ shortURL, id }, { shortURL, id, url: d[0].url, click:  count})
            f(count)
        }else{
            f(false)
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
  updateCount,
  getURL,
  getAllUrls,
  shortURL
}