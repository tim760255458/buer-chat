const Koa = require('koa')
// const router = require('koa-router')()
const serve = require('koa-static')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')
const WebSocket = require('ws')
const WebSocketWrapper = require('ws-wrapper')
const parseUser = require('./parseUser')

const WebSocketServer = WebSocket.Server

const app = new Koa()

app.use(bodyParser()) // 必须在 koa-router 之前注册到 app 对象上
app.use(serve(
    path.join(__dirname, './static')
))

app.use(async (ctx, next) => {
    console.log(`method: ${ctx.request.method}, url: ${ctx.request.path}`)
    // console.log(ctx.cookies)
    console.log('///')
    ctx.state.user = parseUser(ctx.cookies.get('name') || '')
    await next()
})

app.use(controller('controllers'))

let server = app.listen(3000)
console.log('app started at port 3000...')

const wss = new WebSocketServer({
    server: server
})
function noop () {

}
function heartbeat () {
    this.isAlive = true
}
let sockets = {}
wss.on('connection', function (ws, req) {
    // let user = parseUser(req.headers.cookie)
    // console.log('wss: ' + req.headers.cookie)
    // if (!user) {
    //     ws.close(4001, 'Invalid user')
    // }
    // ws.user = user
    ws.isAlive = true
    ws.on('pong', heartbeat)
    ws = new WebSocketWrapper(ws)
    ws.wss = wss
    ws.on('message', function (message) {
        // console.log(message)
        let msg = JSON.parse(message.data)
        console.log(msg)
        if (!sockets[msg.channel]) {
            sockets[msg.channel] = new Set()
            sockets[msg.channel].add(ws)
        } else if (!sockets[msg.channel].has(ws)) {
            sockets[msg.channel].add(ws)
        }
        let pushMessage = null
        if (msg.type === 'chat') {
            pushMessage = {
                name: msg.name,
                type: 'chat',
                channel: msg.channel,
                content: msg.content
            }
        } else if (msg.type === 'insert') {
            pushMessage = {
                name: msg.name,
                type: 'insert',
                channel: msg.channel,
                content: msg.content
            }
        } else {
            pushMessage = msg
        }
        sockets[msg.channel].forEach(val => {
            val.of(msg.channel).emit('message', JSON.stringify(pushMessage))
        })
        // ws.of(msg.channel).emit('message', JSON.stringify({
        //     type: 'message',
        //     content: msg.content
        // }))
        // ws.send(JSON.stringify({
        //     type: 'message',
        //     content: 'hello'
        // }))
    })
    ws.on('disconnect', function () {
        for (let val in sockets) {
            if (sockets[val].has(ws)) {
                sockets[val].delete(ws)
            }
        }
    })
    ws.on('close', function () {
        for (let val in sockets) {
            if (sockets[val].has(ws)) {
                sockets[val].delete(ws)
            }
        }
    })
})

const interval = setInterval(function ping () {
    wss.clients.forEach(function each (ws) {
        console.log('heartbeat scan')
        if (ws.isAlive === false) {
            return ws.terminate()
        }
        ws.isAlive = false
        ws.ping(noop)
    })
}, 3000)
