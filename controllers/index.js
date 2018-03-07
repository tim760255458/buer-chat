let fn_index = async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>'
}
let fn_post_login = async (ctx, next) => {
    let name = ctx.request.body.name || ''
    let password = ctx.request.body.password || ''
    console.log(`name: ${name}, password: ${password}`)
    ctx.response.body = `<h1>${name}: ${password}</h1>
    <p id="message-box"></p>
    <script>
    let p = document.getElementById("message-box")
    let ws = new WebSocket("ws://localhost:3000/login")
    console.log(document.cookie)
    ws.onopen = function (evt) {
        console.log('连接已打开...')
        p.innerText += '连接已打开...///'
        ws.send('hello')
        p.innerText += '发送 hello///'
    }
    ws.onmessage = function (evt) {
        console.log(evt.data)
        p.innerText += '收到消息///'
        p.innerText += evt.data
    }
    </script>`
}
let fn_get_login = async (ctx, next) => {
    ctx.response.body = `<h1>login</h1>
    <form action="/login" method="post">
    <input id="name" type="text" name="name">
    <input type="password" name="password">
    <input id="password" type="submit" valut="提交" onclick="save()">
    </form>
    <script>
    function save () {
        var name = document.getElementById("name")
        var password = document.getElementById("password")
        document.cookie = "name=" + name.value
        document.cookie = "password=" + password.value
    }
    </script>`
}

module.exports = {
    'GET /': fn_index,
    'POST /login': fn_post_login,
    'GET /login': fn_get_login
}
