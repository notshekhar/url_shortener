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
                addrow(doc.url, doc.shortURL, doc.click)
            })
        })
})()

let submit = document.querySelector(".submit")
let url = document.querySelector(".url")
let socket = io(location.origin)

socket.on("url_submitted", data => {
    addrow(data.url, data.shortURL, data.click)
})

let el

socket.on("update_count", count => {
    console.log(count)
    // el.innerText = count
})

submit.onclick = () => {
    let _url = url.value
    if (urlValidator(url)) {
        auth()
        socket.emit("url", { url: _url, id: cookie.getItem("_id") })
    } else {
        alert("Invalid url")
    }
}

function addrow(u, s, c) {
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
    let td2 = new_element("td")
    td2.innerText = c
    tr.append(td0, td1, td2)
    document.querySelector("tbody").prepend(tr)
}

function urlValidator(url) {
    return true
}

let logout = document.querySelector(".logout")

logout.onclick = () => {
    cookie.setItem("_id", "")
    auth()
}
