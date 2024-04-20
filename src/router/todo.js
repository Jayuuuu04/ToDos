import express from "express"
import todoController from "../controllers/todoController.js"
const router = express.Router()

router.post("/create" , todoController.createTodo)

router.put("/update" , todoController.updateTodo)

router.delete('/delete', todoController.deleteTodo)

export default router