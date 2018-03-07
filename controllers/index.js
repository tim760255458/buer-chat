let fn_index = async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>'
}
let fn_login = async (ctx, next) => {
    let name = ctx.request.body.name || ''
    let password = ctx.request.body.password || ''
    console.log(`name: ${name}, password: ${password}`)
    ctx.response.body = `<h1>${name}: ${password}</h1>`
}

module.exports = {
    'GET /': fn_index,
    'POST /login': fn_login,
    'GET /login': fn_login
}
