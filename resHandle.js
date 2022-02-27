const Headers = require('./Header/index')

// res
// statusCode:  API狀態代碼
// status:      API狀態
// data:        回傳的資料訊息
// options:     req方法是否為OPTIONS
function responseHandle(res, statusCode, status, data = '欄位未填寫正確', options = false) {

    res.writeHead(statusCode, Headers)

    if (!options) {
        let resBody = {}

        if (status) {
            resBody.status = 'success'
            resBody.data = data
        } else {
            resBody.status = 'false'

            if (statusCode === 404) {
                resBody.message = '查無此頁'
            } else {
                resBody.message = data
            }
        }

        res.write(JSON.stringify(resBody))
    }

    res.end()
}

module.exports = responseHandle