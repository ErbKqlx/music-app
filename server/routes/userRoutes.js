// import express from "express"
import UserController from "../controllers/userController.js"
import express from 'express'

const router = express.Router()



router.get('/users', UserController.handleGetUsers)

// router.route('/users').post(handleCreateUser)

// router.route('/users/:id').get(handleGetUser)

// router.route('/users/:id').put(handleUpdateUser)

// router.route('/users/:id').delete(handleDeleteUser)

export default router