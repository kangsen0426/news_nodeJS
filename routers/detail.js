const express = require('express')
const handleDB = require('../db/handleBD')
const router = express.Router()


router.get("/news_detail/:news_id",(req,res)=>{

   (async function(){

    //判断是否登入

    let user_id = req.session['user_id']

    let result = []

    if (user_id) {
        //表示已经登入,去数据库查询用户的信息
        result = await handleDB(res, "info_user", "find", "查询数据库出错", `id='${user_id}'`)

    }

       //展示首页右侧 点击排行榜
       let result3 = await handleDB(res, "info_news", "sql", "查询数据库出错", "select * from info_news order by clicks desc limit 6")

    //用户信息
    let data = {
        user_info: result[0] ? {
            nick_name: result[0].nick_name,
            avatar_url: result[0].avatar_url
        } : false,
        newsClick: result3
    }


    res.render('news/detail',data)
   })()

})




module.exports = router