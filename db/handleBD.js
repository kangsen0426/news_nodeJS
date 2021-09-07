const db = require('./nodejs-orm')

async function handleDB(res, tableName, methodName, errMsg, n1, n2) {

    let Model = db.model(tableName)
    let result

    try {
        result = await new Promise((resolve, reject) => {

            //分三种情况

            if (!n1) {
                //如果没有传入 n1 和 n2
                Model[methodName]((err, data) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                })

                return
            }

            //程序执行到这里，说明有 n1
            if (!n2) {
                //有 n1 没有 n2  的情况
                Model[methodName](n1, (err, data) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                })

                return
            }

            //程序执行到这，说明 n1 n2 都有

            Model[methodName](n1, n2, (err, data) => {
                if (err) {
                    reject(err)
                }

                resolve(data)
            })


        })
    } catch (err) {
        console.log(err);

        res.send({errmsg:errMsg})
        return
    }


    return result

}


module.exports = handleDB