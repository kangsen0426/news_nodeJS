
const express = require('express')
// const moment = require('moment')
const handleBD = require('../db/handleBD')
const Captcha = require('../utils/captcha/index')
const md5 = require('md5')
const keys = require('../keys')
const jwt = require('jsonwebtoken')


const router = express.Router()




router.get('/passport/image_code/:float', (req, res) => {

    let captchaObj = new Captcha()
    let captch = captchaObj.getCode()

    //captch.text  图片验证码文本
    //captch.data  图片验证码内容信息

    //保存图片验证码到 session中

    req.session['ImageCode'] = captch.text


    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(captch.data)
})


router.post('/passport/register', (req, res) => {

    /*
    1.获取post 参数，判断是否为空
    2.查询用户输入的图片验证码是否正确，不正确就 return
    3.查询数据库，查看用户是否已经存在
    4.保持用户登入状态
    */

    (async function () {
        //1.获取post 参数，判断是否为空
        let { username, image_code, password, agree } = req.body
        if (!username || !image_code || !password || !agree) {
            res.send({ errmsg: "缺少必传参数" })
            return
        }

        // 2.查询用户输入的图片验证码是否正确，不正确就 return
        if (image_code.toLowerCase() !== req.session['ImageCode'].toLowerCase()) {
            res.send({ errmsg: "图片验证码填写错误" })
            return
        }

        // 3.查询数据库，查看用户是否已经存在

        let result1 = await handleBD(res, "info_user", "find", "数据库查询出错", `username="${username}"`)

        if (result1.length > 0) {

            res.send({ errmsg: "用户名已被注册" })
            return
        }

        let result2 = await handleBD(res, "info_user", "insert", "插入数据库出错", {
            username,
            password_hash: md5(md5(password) + keys.password_key),
            nick_name: username,
            // last_login: moment(new Date().toLocaleString()).format('YYYY-MM-DD')
        })

        //result2.insertId 插入数据时，自动生成的 id


        // 4.保持用户登入状态
        req.session["user_id"] = result2.insertId

        res.send({ errno: '0', errmsg: "注册成功" })


    })()



})

router.post('/passport/login', (req, res) => {

    (async function () {

        //1.获取 post 参数，判空

        let { username, password } = req.body
        if (!username || !password) {
            res.send({ errmsg: "缺少必传参数" })
            return
        }


        //2.判断是否有该用户

        let result = await handleBD(res, "info_user", "find", "数据库查询出错", `username="${username}"`)

        if (!result[0]) {

            res.send({ errmsg: "用户名未注册" })
            return
        }

        //3.校验密码是否正确

        if (md5(md5(password) + keys.password_key) !== result[0].password_hash) {
            res.send({ errmsg: "用户名或密码错误" })
            return
        }



        //4.保存登入状态
        req.session["user_id"] = result[0].id


        //设置最后一次登入时间
        //本在修改字段
        // await handleBD(res, "info_user", "update", "修改数据库出错", `id=${result[0].id}`, { last_login: moment(new Date().toLocaleString()).format('YYYY-MM-DD') })

        res.send({ errno: '0', errmsg: "登入成功" })



    })()

})

router.post('/passport/logout', (req, res) => {

    //退出登入，删除 session 中的信息
    delete req.session["user_id"]

    res.send({ errmsg: "退出登入成功" })

})



router.get("/token", (req,res) => {

    const token = jwt.sign({ id: 1, username: '小康' }, keys.jwt_salt, { expiresIn: 60 * 60 * 2 })

    res.send({
        result: {
            token
        }
    })
})

module.exports = router