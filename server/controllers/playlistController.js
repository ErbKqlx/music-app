// import Response from "../configs/response.js"
// import User from "../models/User.js"
import db from "../models/index.js"

// const User = db.user
const Playlist = db.playlist
const PlaylistsSongs = db.playlists_songs
const Song = db.song

class PlaylistController{
    static async getPlaylists(req, res){
        const playlists = await Playlist.findAll({ where: {
            id_user: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        // console.log(playlists)

        playlists.forEach(function(playlist){
            playlist.image = `http://localhost:8080/${playlist.image}`
            console.log(playlist.image)
        })

        return res.status(200).json({
            playlists
        })
        // return Response.success(res, 'Плейлисты')
    }

    static async getOnePlaylist(req, res){
        const playlist = await Playlist.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        playlist.image = `http://localhost:8080/${playlist.image}`

        return res.status(200).json(playlist)
    }

    static async getPlaylistSongs(req, res){
        // const playlistsSongs = await PlaylistsSongs.findAll({ where: {
        //     id_playlist: req.params.id
        // }}).catch((err) => {
        //     console.log(err)
        // })

        
        

        // const playlist = await Playlist.findOne({ where: {
        //     id: req.params.id
        // }})

        const playlistsSongs = await PlaylistsSongs.findAll({ where: {
            id_playlist: req.params.id
        }})

        const songs = []

        for await (const playlistsSong of playlistsSongs){
            const song = await playlistsSong.getSong()
            song.image = `http://localhost:8080/${song.image}`
            songs.push(song)
        }

        // playlistsSongs.forEach(async function(playlistsSong){
        //     songs.push(await playlistsSong.getSong())
        // })

        // console.log(songs)

        return res.status(200).json(songs)
    }
    
}

export default PlaylistController