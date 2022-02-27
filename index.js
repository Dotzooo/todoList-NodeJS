
const http = require('http')

const { v4: uuidv4 } = require('uuid');
const resHandle = require('./resHandle')
const PORT = process.env.PORT || 3005

const todos = []

const requestListener = (req, res) => {
    const { url, method } = req
    let body = ''

    //  若非/todo之路徑請求, err
    if (!url.startsWith('/todos')) {
        resHandle(res, 404)
    }

    // 接收資料
    req.on('data', chunk => {
        // 組裝封包
        body += chunk
    })

    switch (method) {
        case 'GET':
            // 取得所有代辦事項
            resHandle(res, 200, true, todos)
            break;
        case 'POST':
            // 新增代辦事項

            // 觸發
            req.on('end', () => {
                try {
                    const title = JSON.parse(body).title

                    if (title !== undefined) {
                        todos.push({
                            title,
                            'id': uuidv4()
                        })

                        resHandle(res, 200, true, todos)
                    } else {
                        resHandle(res, 400, false)
                    }

                } catch (error) {
                    resHandle(res, 400, false)
                }
            })
            break;
        case 'DELETE':
            const deleteTodo = url.includes('/todos/')

            if (deleteTodo) {
                // 刪除指定代辦事項
                const id = req.url.split('/').pop()
                const index = todos.findIndex(element => element.id === id)

                if (index !== -1) {
                    todos.splice(index, 1)
                    resHandle(res, 200, true, '刪除成功')
                } else {
                    resHandle(res, 500, false, '刪除失敗，查無該筆代辦事項')
                }

            } else {
                // 刪除所有代辦事項
                todos.length = 0
                resHandle(res, 200, true, todos)
            }

            break;
        case 'PATCH':
            // 編輯指定代辦事項
            req.on('end', () => {

                try {
                    const title = JSON.parse(body).title
                    const id = req.url.split('/').pop()
                    const index = todos.findIndex(element => element.id === id)

                    if (title !== undefined && index !== -1) {
                        todos[index].title = title
                        resHandle(res, 200, true, todos)
                    } else {
                        resHandle(res, 400, false)
                    }
                } catch (error) {
                    resHandle(res, 400, false)
                }
            })
            break
        case 'OPTIONS':
            //RESTful API preflight
            resHandle(res, 200, null, null, true)
            break;
        default:
            break;
    }
}

const server = http.createServer(requestListener)
server.listen(PORT)