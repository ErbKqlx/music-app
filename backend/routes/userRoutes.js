const express = require('express')
const router = express.Router()

const { getUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userController')

router.route('/users').get(getUsers)

router.route('/users').post(createUser)

router.route('/users/:id').get(getUser)

router.route('/users/:id').put(updateUser)

router.route('/users/:id').delete(deleteUser)

module.exports = router;