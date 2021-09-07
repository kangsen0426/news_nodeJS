const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const keys = require('./keys')
const path = require('path')

const common = require('./utils/common')

//引入router 对象
const indexRouter = require('./routers/index')
const passPortRouter = require('./routers/passport')
const detailtRouter = require('./routers/detail')



//函数方式导出

// let appConfig = (app) => {
//     //1.指定静态资源文件夹
//     app.use(express.static('public'))


//     //2.模板的配置
//     //引入 express-art-template 引擎
//     app.engine('html', require('express-art-template'));
//     app.set('view options', {
//         debug: process.env.NODE_ENV !== 'production'
//     });
//     //设置在哪个目录下查找 模板文件
//     app.set('views', path.join(__dirname, 'views'));

//     //设置模板后缀名
//     app.set('view engine', 'html');



//     //3.获取post请求参数的配置
//     app.use(bodyParser.urlencoded({ extended: false }))
//     app.use(bodyParser.json())


//     //4.注册 cookie 和 session
//     app.use(cookieParser())
//     app.use(cookieSession({
//         name: 'my_session',
//         keys: ["djqikj35j4h56jbsfb5%ahfja%afbnajkfb!asfnajhfnafa%safhajskf"],
//         maxAge: 1000 * 60 * 60 * 24 * 2
//     }))
// }


//面向对象方式导出

class AppConfig {

    //看成创建对象时就要执行的代码，写在 constructor 里
    constructor(app) {
        this.app = app
        this.listenPort = 3000

        //1.指定静态资源文件夹
        this.app.use(express.static('public'))


        //2.模板的配置
        //引入 express-art-template 引擎
        this.app.engine('html', require('express-art-template'));
        this.app.set('view options', {
            debug: process.env.NODE_ENV !== 'production'
        });
        //设置在哪个目录下查找 模板文件
        this.app.set('views', path.join(__dirname, 'views'));

        //设置模板后缀名
        this.app.set('view engine', 'html');



        //3.获取post请求参数的配置
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())


        //4.注册 cookie 和 session
        this.app.use(cookieParser())
        this.app.use(cookieSession({
            name: 'my_session',
            keys: [keys.session_key],
            maxAge: 1000 * 60 * 60 * 24 * 2
        }))

        //将router 对象注册到 app 下
        this.app.use(/*common.ccsrfProtect,*/indexRouter)
        this.app.use(/*common.ccsrfProtect,*/passPortRouter);
        this.app.use(/*common.ccsrfProtect,*/detailtRouter);
    }
}

module.exports = AppConfig