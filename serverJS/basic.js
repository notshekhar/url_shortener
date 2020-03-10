function delay(milliseconds) {
    let start = new Date().getTime()
    for (let i = 0; i < i + 2; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break
        }
    }
}

function getDetails(req, type) {
    let shortURL = req.params.surl
    let ua = req.headers["user-agent"]
    let a = {}

    if (/mobile/i.test(ua)) a.mobile = true

    if (/like Mac OS X/.test(ua)) {
        a.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/
            .exec(ua)[2]
            .replace(/_/g, ".")
        a.iPhone = /iPhone/.test(ua)
        a.iPad = /iPad/.test(ua)
    }

    if (/Android/.test(ua)) a.android = /Android ([0-9\.]+)[\);]/.exec(ua)[1]

    if (/webOS\//.test(ua)) a.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1]

    if (/(Intel|PPC) Mac OS X/.test(ua))
        a.mac =
            /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/
                .exec(ua)[2]
                .replace(/_/g, ".") || true

    if (/Windows NT/.test(ua))
        a.windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1]

    if (/firefox/i.test(ua)) a.browser = "firefox"
    else if (/chrome/i.test(ua)) a.browser = "chrome"
    else if (/safari/i.test(ua)) a.browser = "safari"
    else if (/msie/i.test(ua)) a.browser = "msie"
    else a.browser = "unknown"

    a.datetime = Date.now()
    a.shortURL = shortURL
    a.IP = req.header("x-forwarded-for")
    a.requestType = type
    return a
}


module.exports = {
    getDetails,
    delay
}