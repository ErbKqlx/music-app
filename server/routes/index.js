import UserController from "../controllers/userController.js"
import AuthController from "../controllers/authController.js"
import express from 'express'
import verifySignUp from "../middlewares/verifySignUp.js"
import authJwt from "../middlewares/authJwt.js"
import PlaylistController from "../controllers/playlistController.js"
import SongController from "../controllers/songController.js"
import db from "../models/index.js"
import SearchController from "../controllers/searchController.js"
import { upload } from "../configs/multer.js"
import { uploadImage } from "../middlewares/uploadImage.js"
import { uploadTrackFiles } from "../middlewares/uploadTrackFiles.js"
import GenreController from "../controllers/genreController.js"

const router = express.Router()

const Song = db.song
const Artist = db.artist

router.get('/users/:id', [authJwt.verifyToken], UserController.getUserData)

router.get('/users/:id/playlists', [authJwt.verifyToken], PlaylistController.getPlaylists)
router.get('/playlist/:id', [authJwt.verifyToken], PlaylistController.getOnePlaylist)
// router.get('/playlist/:id/songs', [authJwt.verifyToken], PlaylistController.getPlaylistSongs)
router.post('/playlist', authJwt.verifyToken, uploadImage, PlaylistController.createPlaylist)
router.patch('/playlist/:id', authJwt.verifyToken, uploadImage, PlaylistController.updatePlaylist)
router.delete('/playlist/:id', [authJwt.verifyToken], PlaylistController.deletePlaylist)

router.post('/song', uploadTrackFiles, SongController.createSong)
router.patch('/song/:id', uploadTrackFiles, SongController.updateSong)
router.delete('/song/:id', [authJwt.verifyToken], SongController.deleteSong)
router.get('/song/:id', [authJwt.verifyToken], SongController.getOneSong)

router.get('/search', [authJwt.verifyToken], SearchController.search)

router.get('/genres', [authJwt.verifyToken], GenreController.getGenres)

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/verify-code', AuthController.verifyCode);

export default router