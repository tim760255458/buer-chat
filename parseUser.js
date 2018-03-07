module.exports = function parseUser (obj) {
    if (!obj) {
        return
    }
    let s = ''
    // console.log(obj)
    console.log('try parse: ' + obj)
    if (typeof obj === 'string') {
        s = obj
        return {
            name: s
        }
    } else if (obj.headers) {
        // let cookies = new Cookies(obj, null)
        // s = cookies.get('name')
    }
    if (s) {
        // try {
        //     let user = JSON.parse(Buffer.from(s, 'base64').toString())
        //     console.log(`User: ${user.name}, ID: ${user.id}`)
        //     return user
        // } catch (error) {
        //     console.log(error)
        // }
    }
}