import UserController from "../controllers/userController.js"
import AuthController from "../controllers/authController.js"
import express from 'express'
import verifySignUp from "../middlewares/verifySignUp.js"
import authJwt from "../middlewares/authJwt.js"
import PlaylistController from "../controllers/playlistController.js"
import SongController from "../controllers/songController.js"

const router = express.Router()



// router.get('/users', UserController.handleGetUsers)

router.get('/users/:id', [authJwt.verifyToken], UserController.getUserData)



router.get('/users/:id/playlists', [authJwt.verifyToken], PlaylistController.getPlaylists)
router.get('/playlist/:id', [authJwt.verifyToken], PlaylistController.getOnePlaylist)
router.get('/playlist/:id/songs', [authJwt.verifyToken], PlaylistController.getPlaylistSongs)

router.get('/song/:id', [authJwt.verifyToken], SongController.getOneSong)

// router.route('/users').post(handleCreateUser)

// router.route('/users/:id').get(handleGetUser)

// router.route('/users/:id').put(handleUpdateUser)

// router.route('/users/:id').delete(handleDeleteUser)


router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
// router.post('/logout', [authJwt.verifyToken], AuthController.logout)
router.post('/verify-code', AuthController.verifyCode);
// router.get('/check-email', AuthController.register)

export default router