const handleDB = require('../db/handleBD')


function getRandomString(n) {
    var str = "";
    while (str.length < n) {
        str += Math.random().toString(36).substr(2);
    }

    console.log(srt);

    return str.substr(str.length - n)
}


function csrfProtect(req, res, next) {
    console.log("-------------------------------------csrfProtect")
    let method = req.method
    if (method == "GET") {
        let csrf_token = getRandomString(48);
        res.cookie('csrf_token', csrf_token);
        next() //执行跳转到下一个函数执行，即app.use(beforeReq,router)中的下一个
    } else if (method == "POST") {
        // 判断响应头中的x-csrftoken值，和cookies中的csrf_token进行对比
        console.log(req.headers["x-csrftoken"]);
        console.log(req.cookies["csrf_token"]);

        if ((req.headers["x-csrftoken"] === req.cookies["csrf_token"]) && req.headers["x-csrftoken"]) {
            console.log("csrf验证通过！");
            next()
        } else {
            res.json({ errmsg: "csrf验证不通过!！" });
            return
        }
    }
}


async function getUSer(req,res){

    let user_id = req.session['user_id']

    let result = []

    if (user_id) {
        //表示已经登入,去数据库查询用户的信息
        result = await handleDB(res, "info_user", "find", "查询数据库出错", `id='${user_id}'`)

    }

    return result

}



module.exports = {
    csrfProtect,
    getUSer
}