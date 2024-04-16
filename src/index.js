import express from "express"
import bodyParser from "body-parser"
import constants from "./helpers/constants.js"
import cors from "cors"
import path from "path"
const app = express()

const port = constants.PORT || 3000

// commented
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    console.log('Hello !!! ToDo App Welcomes You..')
})

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.listen(port, (req,res) => {
    console.log(`App is Working on port : http://localhost:${port}`)
})