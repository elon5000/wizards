export const utilService = {
    makeId,
    getRandomInt,
    getColors
}

function getColors() {
    return ['#8ca682', '#ac909d', '#224b5e', '#965071', '#6c553b', '#484752', '#124f51', '#5e4848', '#36523d', '#a15d41']
}

function makeId(length = 6) {
    let id = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return id
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}