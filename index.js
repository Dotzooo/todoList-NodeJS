
const http = require('http')

const { v4: uuidv4 } = require('uuid');
const resHandle = require('./resHandle')

const todos = []

const requestListener = (req, res) => {
    let body = ''

    // 接收資料
    req.on('data', chunk => {
        // 組裝封包
        body += chunk
    })

    if (req.url === '/todos' && req.method === 'GET') {
        // 取得所有代辦事項
        resHandle(res, 200, true, todos)
    } else if (req.url === '/todos' && req.method === 'POST') {
        // 新增代辦事項

        // 觸發
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title

                if (title !== undefined) {
                    todos.push({
                        'title': title,
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
    } else if (req.url === '/todos' && req.method === 'DELETE') {
        // 刪除所有代辦事項
        todos.length = 0
        resHandle(res, 200, true, todos)

    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
        // 刪除指定代辦事項
        const id = req.url.split('/').pop()
        const index = todos.findIndex(element => element.id === id)

        if (index !== -1) {
            todos.splice(index, 1)
            resHandle(res, 200, true, '刪除成功')
        } else {
            resHandle(res, 500, false, '刪除失敗，查無該筆代辦事項')
        }

    } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
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
        
    } else if (req.method === 'OPTIONS') {
        //RESTful API preflight
        resHandle(res, 200, null, null, true)
    } else {
        resHandle(res, 404)
    }



}

const server = http.createServer(requestListener)
server.listen(3005)