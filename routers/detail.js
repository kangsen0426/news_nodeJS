const express = require('express')
const handleDB = require('../db/handleBD')
const common = require('../utils/common')

const router = express.Router()

require("../utils/filter")


router.get("/news_detail/:news_id", (req, res) => {

    (async function () {

        //判断是否登入

        let result = await common.getUSer(req, res)

        //展示首页右侧 点击排行榜
        let result3 = await handleDB(res, "info_news", "sql", "查询数据库出错", "select * from info_news order by clicks desc limit 6")


        let { news_id } = req.params
        //新闻内容的查询
        let newsResult = await handleDB(res, "info_news", "find", "查询数据库出错", `id=${news_id}`)

        let data = {
            user_info: result[0] ? {
                nick_name: result[0].nick_name,
                avatar_url: result[0].avatar_url
            } : false

        }


        if (!newsResult[0]) {
            res.render("news/404", data)
            return
        }

        //点击数加一
        await handleDB(res, "info_news", "update", "更新数据库出错", `id=${news_id}`, { clicks: newsResult[0].clicks + 1 })

        newsResult[0].clicks + 1

        let isCollected = false

        if (result[0]) {
            let collectResult = await handleDB(res, "info_user_collection", "find", "查询数据库出错", `user_id=${result[0].id} and news_id=${news_id}`)

            if (collectResult[0]) {
                isCollected = true
            }
        }

        //用户信息
        data = {
            user_info: result[0] ? {
                nick_name: result[0].nick_name,
                avatar_url: result[0].avatar_url
            } : false,
            newsClick: result3,
            newsData: newsResult[0],
            isCollected
        }


        res.render('news/detail', data)
    })()

})


router.post("/news_detail/news_collect", (req, res) => {

    (async function () {

        let result = await common.getUSer(req, res)

        if (!result[0]) {
            res.send({ errno: 4101, errmsg: "用户未登入" })
            return
        }

        let { news_id, action } = req.body;

        if (!news_id || !action) {
            res.send({ errmsg: "参数错误" })
            return
        }

        let newsResult = await handleDB(res, "info_news", "find", "查询数据库出错", `id=${news_id}`)

        if (!newsResult[0]) {
            res.send({ errmsg: "参数错误" })
            return
        }

        if (action === "collect") {
           await handleDB(res, "info_user_collection", "insert", "数据库添加出错", { user_id: result[0].id, news_id })
      
        } else {
           await handleDB(res, "info_user_collection", "delete", "删除数据库出错", `user_id=${result[0].id} and news_id=${news_id}`)

         
        }

        res.send({ errno: "0" })



    })()

})

router.post("/news_detail/news_comment", (req, res) => {

    (async function () {

        let result = await common.getUSer(req, res)

        if (!result[0]) {
            res.send({ errno: 4101, errmsg: "用户未登入" })
            return
        }

        console.log(req.body);

        let { news_id, comment,parent_id=null } = req.body;

        if (!news_id || !comment) {
            res.send({ errmsg: "参数错误1" })
            return
        }

        let newsResult = await handleDB(res, "info_news", "find", "查询数据库出错", `id=${news_id}`)

        if (!newsResult[0]) {
            res.send({ errmsg: "参数错误2" })
            return
        }

        let commentObj = { user_id: result[0].id, news_id ,content:comment}

        if(parent_id){
            commentObj.parent_id = parent_id
        }

        await handleDB(res, "info_comment", "insert", "数据库添加出错", commentObj)


        res.send({ errno: "0" ,errmsg:"操作成功"})


    })()

})


router.post("/news_detail/comment_like", (req, res) => {

    (async function () {

        let result = await common.getUSer(req, res)

        if (!result[0]) {
            res.send({ errno: 4101, errmsg: "用户未登入" })
            return
        }

        console.log(req.body);

        let { action, comment_id } = req.body;

        console.log(req.body);

        let commentResult = await handleDB(res, "info_comment", "find", "查询数据库出错", `id=${comment_id}`)

        if (!commentResult[0]) {
            res.send({ errmsg: "参数错误2" })
            return
        }



       


    })()

})





module.exports = router