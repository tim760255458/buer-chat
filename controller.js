const fs = require('fs')
const router = require('koa-router')()

// 导入对各种路径的处理
function addMapping (router, mapping) {
    for(let url in mapping) {
        if (url.startsWith('GET')) {
            let path = url.substring(4)
            router.get(path, mapping[url])
        } else if (url.startsWith('POST')) {
            let path = url.substring(5)
            router.post(path, mapping[url])
        } else {
            console.log(`invalid URL: ${url}`)
        }
    }
}

// 从 dir 文件夹中读取 js 文件后，调用 addMapping
function addControllers (router, dir) {
    let files = fs.readdirSync(__dirname + `/${dir}`)
    let js_files = files.filter((f) => {
        return f.endsWith('.js')
    })

    for(let f of js_files) {
        let mapping = require(__dirname + '/controllers/' + f)
        addMapping(router, mapping)
    }
}

module.exports = function (dir) {
    let controllers_dir = dir || 'controllers'
    addControllers(router, controllers_dir)
    return router.routes()
}
