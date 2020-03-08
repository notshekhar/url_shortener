export function delay(milliseconds) {
    let start = new Date().getTime()
    for (let i = 0; i < i + 2; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break
        }
    }
}
