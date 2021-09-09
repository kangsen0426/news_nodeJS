
const express = require('express')
const common = require('../utils/common')
const handleBD = require('../db/handleBD')
const multer  = require('multer')
const upload = multer({dest:"public/news/upload/avatar"})

const router = express.Router()


router.get("/profile",(req,res)=>{

    (async function(){
        let result = await common.getUSer(req, res)

    if (!result[0]) {
        res.redirect("/")
        return
    }
    
    res.render("news/user")
    })()
})

router.get("/user/pic_info",(req,res)=>{


    console.log(req.file);

    res.render("news/user_pic_info")
})
router.post("/user/pic_info",upload.single("avatar"),(req,res)=>{


    console.log(req.file);

    res.send(req.file)
})



module.exports = router