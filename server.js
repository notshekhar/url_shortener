let express = require("express")
let dotenv = require("dotenv")
let cookies = require("cookie-parser")
let socket = require("socket.io")

let { signup, getID, login, auth } = require("./serverJS/auth.js")
let {
    shortURL,
    getAllUrls,
    getURL,
    updateCount
} = require("./serverJS/urls.js")

dotenv.config()

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(cookies())
app.use(express.static("public"))
const server = app.listen(process.env.PORT, () => {
    console.log("Listening to port: " + process.env.PORT + "")
})

const io = socket(server)
let soc
io.on("connection", s => {
    soc = s
    soc.on("url", data => {
        shortURL(data.url, data.id, r => {
            soc.emit("url_submitted", r)
        })
    })
})

app.get("/auth", (req, res) => {
    let _id = req.cookies._id
    auth(_id, r => {
        res.json(r)
    })
})
app.get("/getAllurls", (req, res) => {
    let _id = req.cookies._id
    getAllUrls(_id, data => {
        res.json(data)
    })
})
app.get("/:surl", (req, res) => {
    console.log(details(req))
    let shortURL = req.params.surl
    getURL(shortURL, url => {
        updateCount(shortURL, count => {
            if (count.count != false) soc.emit("update_count", count)
        })
        if (url.fetch) res.redirect(url.src)
        else res.redirect("/home")
    })
})
app.get("/logout", (req, res) => {
    console.log("logout")
    res.cookie("_id", "")
    res.redirect("/login")
})
app.post("/signup", (req, res) => {
    // console.log(req.body)
    // res.redirect("/")
    if ((req.body.username.length > 3) & (req.body.password.length > 7))
        signup(req.body.username, req.body.password, r => {
            if (r.signup) {
                // let id = r.id
                res.cookie("_id", r.id)
                res.redirect("/home")
            } else {
                res.redirect("/error")
            }
        })
    else res.redirect("/error")
})
app.post("/login", (req, res) => {
    // console.log(req.body)
    // res.redirect("/")
    login(req.body.username, req.body.password, r => {
        if (r.login) {
            res.cookie("_id", r.data.id)
            res.redirect("/home")
        } else {
            res.redirect("/error")
        }
    })
})


function details(req){
    let shortURL = req.params.surl 
    let ua = req.headers['user-agent'];
    let a = {};

    if (/mobile/i.test(ua))
        a.mobile = true;

    if (/like Mac OS X/.test(ua)) {
        a.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        a.iPhone = /iPhone/.test(ua);
        a.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua))
        a.android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

    if (/webOS\//.test(ua))
        a.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

    if (/(Intel|PPC) Mac OS X/.test(ua))
        a.mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

    if (/Windows NT/.test(ua))
        a.windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
  
    if( /firefox/i.test(ua) )
      a.browser = 'firefox';
    else if( /chrome/i.test(ua) )
      a.browser = 'chrome';
    else if( /safari/i.test(ua) )
      a.browser = 'safari';
    else if( /msie/i.test(ua) )
      a.browser = 'msie';
    else
      a.browser = 'unknown';
    
    a.datetime = Date.now()
    a.shortURL = shortURL
    a.IP = req.header('x-forwarded-for')
  
    return a 
}
