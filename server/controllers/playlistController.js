// import Response from "../configs/response.js"
// import User from "../models/User.js"
import { Op } from "sequelize"
import db from "../models/index.js"
import Response from "../configs/response.js"

// const User = db.user
const Playlist = db.playlist
const PlaylistsSongs = db.playlists_songs
const Song = db.song
const Artist = db.artist

const host = 'http://localhost:8080/'

class PlaylistController{
    static async getPlaylists(req, res){
        const playlists = await Playlist.findAll({ where: {
            id_user: req.params.id,
            [Op.or]: [
                { public: true },
                { id_user: req.userId }
            ]
        }}).catch((err) => {
            console.log(err)
        })

        // console.log(playlists)


        playlists.forEach(function(playlist){
            playlist.image = `${host}${playlist.image}`
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

        if (!playlist){
            return res.status(404).json({
                errorMessage: 'Плейлист не найден'
            })
        }

        if (!playlist.public && playlist.id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Это приватный плейлист'
            })
        }


        playlist.image = `${host}${playlist.image}`
        
        const user = await playlist.getUser()
        // const song = playlist.get
        const songs = await playlist.getSongs()
        // console.log(await songs[0].hasArtists())
        const songsData = await Promise.all(
            songs.map(async song => {
            // console.log(await song.getArtists())
                song.image = `${host}${song.image}`
                song.song_url = `${host}${song.song_url}`
                const artists = await song.getArtists()
            
                const artistsData = artists.map(artist => {
                    return {
                        id: artist.id,
                        name: artist.name,
                    }
                })
                // console.log(artistsData)
                return {
                    id: song.id,
                    name: song.name,
                    length: song.length,
                    artists: artistsData,
                    image: song.image,
                    song_url: song.song_url,
                    release_date: song.release_date,
                    lyrics: song.lyrics,
                }
            })
        )

        console.log(songsData)
        // console.log(songs[0])

        // return res.status(200).json(playlist)
        return res.status(200).json({
            data: {
                id: playlist.id,
                name: playlist.name,
                user: {
                    id: user.id,
                    username: user.username,
                },
                songs: songsData,
                created_at: playlist.created_at,
                image: playlist.image,
                public: playlist.public
            }
        })
    }

    static async getPlaylistSongs(req, res){
        const playlistsSongs = await PlaylistsSongs.findAll({ where: {
            id_playlist: req.params.id
        }})

        // const songs = []

        // for await (const playlistsSong of playlistsSongs){
        //     const song = await playlistsSong.getSong()
        //     song.image = `${host}${song.image}`
        //     songs.push(song)
        // }

        const playlistSongs = await PlaylistsSongs.findAll({
            where: { id_playlist: req.params.id },
            include: [{
                model: Song,
                as: 'song'
            }]
        })

        const songs = playlistSongs.map(playlistsSong => {
            const song = playlistsSong.song.toJSON()
            song.image = `${host}${song.image}`
            return song
        })


        return res.status(200).json(songs)
    }

    static async createPlaylist(req, res){
        // const { name, public, id_user } = req.body
        const name = req.body.name
        const isPublic = req.body.public
        const id_user = req.body.id_user

        if (id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено'
            })
        }

        return Response.success(res, 'Плейлист создан')
    }

    static async updatePlaylist(req, res){
        // const { name, public, id_user } = req.body

        const name = req.body.name
        const isPublic = req.body.public
        const userId = req.body.id_user

        console.log(req.body)


        if (userId != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено редактировать чужой плейлист'
            })
        }

        const playlist = await Playlist.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        playlist.name = name
        playlist.public = isPublic
        await playlist.save()

        console.log(name)


        return Response.success(res, 'Плейлист обновлен')
    }
    
}

export default PlaylistController