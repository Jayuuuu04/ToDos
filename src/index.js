import express from "express"
import bodyParser from "body-parser"
import constants from "./helpers/constants.js"
import cors from "cors"
import knex from "./config/dbConfig.js"

import todo from "./router/todo.js"

const app = express()
const port = constants.PORT || 3000
const SUB_URI = constants.SUB_URI


app.get('/', (req,res) => {
    console.log(`You are in ToDos App...`)
})

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use(`${SUB_URI}/todo`, todo)

app.listen(port, (req,res) => {
    console.log(`App is Working on port : http://localhost:${port}`)
})