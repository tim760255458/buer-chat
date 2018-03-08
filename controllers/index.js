let fn_index = async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1><a href="/login">登录</a>'
}
let fn_post_login = async (ctx, next) => {
    let name = ctx.request.body.name || ''
    let password = ctx.request.body.password || ''
    console.log(`name: ${name}, password: ${password}`)
    ctx.response.body = `<h1>${name}，您已登录成功！<a href="/chat">去聊天</a></h1>`
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
