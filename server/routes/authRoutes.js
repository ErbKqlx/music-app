// import express from "express"
import AuthController from "../controllers/authController.js"
import express from 'express'

const router = express.Router()

router.post('/login', AuthController.login)

export default router