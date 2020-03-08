let datastore = require("nedb")
let dotenv = require("dotenv")
dotenv.config()

let db = new datastore({
    filename: process.env.USERS,
    corruptAlertThreshold: 1
})
db.loadDatabase(err => {
    if (err) console.log(err)
})

function login(username, password, func) {
    db.find(
        { $and: [{ username: username }, { password: password }] },
        (err, docs) => {
            if (docs.length != 1) {
                func({
                    login: false,
                    message: "Incorrect Password or Username"
                })
            } else {
                func({ login: true, data: docs[0] })
            }
        }
    )
}
function signup(username, password, func) {
    db.find({ username: username }, (err, docs) => {
        if (docs.length == 1) {
            func({ signup: false, message: "User Already Exist" })
        } else {
            db.insert(
                { username, password, id: generateRandomString() },
                (err, newDoc) => {
                    func({
                        signup: true,
                        message: "Successfully Created Account",
                        id: newDoc.id
                    })
                }
            )
        }
    })
}
function getID(username, password, func) {
    db.find(
        { $and: [{ username: username }, { password: password }] },
        (err, doc) => {
            if (err) console.log(err, "auth")
            func(doc.id)
        }
    )
}
function auth(_id, f) {
    db.find({ id: _id }, (err, doc) => {
        if (err) f({ auth: false, message: "Internal Error" })

        if (doc.length != 1) f({ auth: false, message: "Failed" })
        else f({ auth: true, username: doc[0].username })
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
  auth, 
  login,
  signup,
  getID
}