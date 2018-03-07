let fn_hello = async (ctx, next) => {
    ctx.response.body = '<h1>hello page</h1>'
}

module.exports = {
    'GET /hello': fn_hello
}
