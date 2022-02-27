# todoList node.js

## run project
      npm start || nodemon index.js
      
### [heroku setting](https://devcenter.heroku.com/articles/nodejs-support#node-js-runtimes)

      // 為了滿足正式環境中的node的端口啟動需求，在node啟動時設置process.env.PORT，讀取當前目錄下環境變量port的值
      1.PORT = precess.env.PORT 
      
      
      2.package.json : {
          script: {
            "start": "node index.js"
          },
          engine: {
            "node": "16.x" // Heroku engine to run node version. 
           }
      }
