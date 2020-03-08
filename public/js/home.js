auth()
function auth() {
    let container = document.querySelector(".container")
    let user = document.querySelector("h3")

    fetch("/auth")
        .then(d => d.json())
        .then(e => {
            if (e.auth) {
                container.style.display = "block"
                user.innerText = "Welcome, " + e.username + ""
            } else location.href = "/"
        })
        .catch(() => console.log("f"))
}

;(function getAllRows() {
    auth()
    let id = cookie.getItem("_id")
    fetch("/getAllurls")
        .then(d => d.json())
        .then(e => {
            e.forEach(doc => {
                addrow(doc.url, doc.shortURL, doc.click, doc._id)
            })
        })
})()

let submit = document.querySelector(".submit")
let url = document.querySelector(".url")
let socket = io(location.origin)

socket.on("url_submitted", data => {
    addrow(data.url, data.shortURL, data.click, data._id)
})

socket.on("update_count", count => {
    let el = document.querySelector(`#${count.id}`)
    el.innerText = count.count
})

submit.onclick = () => {
    let _url = makeUrl(url.value)
    auth()
    socket.emit("url", { url: _url, id: cookie.getItem("_id") })
}

function addrow(u, s, c, _id) {
    let tr = new_element("tr")
    let td0 = new_element("td")
    let a0 = new_element("a", {
        target: "_blank",
        innerText: u,
        href: u
    })
    td0.append(a0)
    let td1 = new_element("td")
    let a1 = new_element("a", {
        target: "_blank",
        innerText: s,
        href: "/" + s
    })
    a1.addEventListener("click", e => {
        // e.preventDefault()
        el = e.toElement.parentElement.parentElement.cells[2]
        el.innerText = parseInt(el.innerText) + 1
    })
    td1.append(a1)
    let td2 = new_element("td", {
        innerText: c,
        id: _id
    })
    tr.append(td0, td1, td2)
    document.querySelector("tbody").prepend(tr)
}

function makeUrl(str) {
    let a = str.split(":")
    let url = str
    if (a[0] == "https" || a[0] == "http") return url
    else return "https://" + url
}

let logout = document.querySelector(".logout")

logout.onclick = () => {
    cookie.setItem("_id", "")
    auth()
}
