const express = require('express')
const handleDB = require('../db/handleBD')
const common = require('../utils/common')
const router = express.Router()

router.get('/', (req, res) => {

    (async function () {

        //判断是否登入

        let result = await common.getUSer(req,res)


        //展示首页头部分类信息
        let result2 = await handleDB(res, "info_category", "find", "查询数据库出错", ["name"])

        //展示首页右侧 点击排行榜
        let result3 = await handleDB(res, "info_news", "sql", "查询数据库出错", "select * from info_news order by clicks desc limit 6")


        //用户信息
        let data = {
            user_info: result[0] ? {
                nick_name: result[0].nick_name,
                avatar_url: result[0].avatar_url
            } : false,
            category: result2,
            newsClick: result3
        }

        res.render('news/index', data)


    })()


})

// router.get('/getcookie', (req, res) => {

//     req.cookies["name"]

//     res.send(req.cookies["name"])
// })

// router.get('/getsession', (req, res) => {

//     req.session["age"]

//     console.log(req.session["age"]);

//     res.send('ok')

// })

// router.get('/get_data', (req, res) => {

//     (async function () {
//         let result = await handleDB(res, "info_category", "find", "数据库查询出错");
//         res.send(result)
//     })()



// })

router.get('/news_list', (req, res) => {

    (async function () {

        let { cid = 1, page = 1, pre_page = 5 } = req.query;



        let wh = cid == 1 ? "1" : `category_id=${cid}`
        let result = await handleDB(res, "info_news", "limit", "数据库查询出错", {
            where: `${wh} order by create_time desc`,
            number: page,
            count: pre_page
        });

        //计算总页数 和当前页数
        let result2 = await handleDB(res, "info_news", "sql", "数据库查询出错", "select count(*) from info_news where " + wh)

        let totalPage = Math.ceil(result2[0]['count(*)'] / pre_page)

        res.send({
            newsList: result,
            currentPage: Number(page),
            totalPage
        })
    })()



})




module.exports = router