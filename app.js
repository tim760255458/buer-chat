const Koa = require('koa')
// const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')

const app = new Koa()

app.use(bodyParser()) // 必须在 koa-router 之前注册到 app 对象上

app.use(async (ctx, next) => {
    console.log(`method: ${ctx.request.method}, url: ${ctx.request.path}`)
    await next()
})

app.use(controller('controllers'))

app.listen(3000)
console.log('app started at port 3000...')