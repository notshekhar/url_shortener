function auth() {
    let container = document.querySelector(".container")
    fetch("/auth")
        .then(d => d.json())
        .then(e => {
            if (e.auth) location.href = "/home"
            else container.style.display = "block"
        })
        .catch(() => console.log("f"))
}

auth()
