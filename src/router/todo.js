import express from "express"
import todoController from "../controllers/todoController.js"
const router = express.Router()

router.post("/create" , todoController.create)

router.put("/update" , todoController.update)


export default router