const Koa = require('koa')
// const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')
const WebSocket = require('ws')
const parseUser = require('./parseUser')

const WebSocketServer = WebSocket.Server

const app = new Koa()

app.use(bodyParser()) // 必须在 koa-router 之前注册到 app 对象上

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
wss.on('connection', function (ws, req) {
    // let user = parseUser(req.headers.cookie)
    // console.log('wss: ' + req.headers.cookie)
    // if (!user) {
    //     ws.close(4001, 'Invalid user')
    // }
    // ws.user = user
    ws.wss = wss
    ws.on('message', function (message) {
        console.log(message)
        ws.send('hello')
    })
})
