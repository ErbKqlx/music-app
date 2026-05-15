// import Response from "../configs/response.js"
// import User from "../models/User.js"
import { Op } from "sequelize"
import db from "../models/index.js"
import Response from "../configs/response.js"
import fs from 'fs';
import path from 'path';
import { deleteFile } from "../utils/filesystem.js";

// const User = db.user
const Playlist = db.playlist
const PlaylistsSongs = db.playlists_songs
const Song = db.song
const Artist = db.artist

const host = 'http://localhost:8080'

class PlaylistController{
    static async getPlaylists(req, res){
        const playlists = await Playlist.findAll({ where: {
            id_user: req.params.id,
            [Op.or]: [
                { public: true },
                { id_user: req.userId }
            ],
        },
    order: [['updated_at', 'DESC']]}).catch((err) => {
            console.log(err)
        })

        // console.log(playlists)

        playlists.forEach(function(playlist){
            playlist.image = `${host}/${playlist.image}`
            // console.log(playlist.image)
        })

        // const playlistsData = await Promise.all(
        //     playlists.map(async playlist => {
        //     // console.log(await song.getArtists())
        //         playlist.image = `${host}${playlist.image}`
        //         // const song_count = await playlist.getSongs()
        //         // console.log(song_count)
            
        //         return {
        //             id: playlist.id,
        //             id_user: playlist.id_user,
        //             name: playlist.name,
        //             public: playlist.public,
        //             created_at: playlist.created_at,
        //             updated_at: playlist.updated_at,
        //             image: playlist.image,
        //             // song_count: song_count
        //         }
        //     })
        // )

        // console.log(playlistsData)

        // return Response.success(res, 'Вывод плейлистов', playlists)

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


        playlist.image = `${host}/${playlist.image}`
        
        const user = await playlist.getUser()
        // const song = playlist.get
        const songs = await playlist.getSongs()
        // console.log(await songs[0].hasArtists())
        const songsData = await Promise.all(
            songs.map(async song => {
            // console.log(await song.getArtists())
                song.image = `${host}/${song.image}`
                song.song_url = `${host}/${song.song_url}`
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
            // order: [['created_at', 'ASC']],
            include: [{
                model: Song,
                as: 'song'
            }],
        })

        const songs = playlistSongs.map(playlistsSong => {
            const song = playlistsSong.song.toJSON()
            song.image = `${host}/${song.image}`
            return song
        })


        return res.status(200).json(songs)
    }

    static async createPlaylist(req, res){
        // const { name, public, id_user } = req.body
        let name = req.body.name
        const isPublic = req.body.public
        const id_user = req.body.id_user

        if (id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено'
            })
        }

        let imagePath = req.file 
            ? `uploads/covers/${req.file.filename}` 
            : `uploads/default/placeholder.jpg`;

        // console.log(req.file)

        const playlists = await Playlist.findAll({ where: {
            id_user: id_user,
        }}).catch((err) => {
            console.log(err)
        })

        if (!name || name.trim() == ''){
            name = 'Плейлист №' + (playlists.length + 1)
        }

        await Playlist.create({
            name: name,
            public: isPublic,
            id_user: id_user,
            image: imagePath,
            created_at: Date.now(),
            updated_at: Date.now(),
        })

        return Response.success(res, 'Плейлист создан')
    }

    static async updatePlaylist(req, res){
        // const { name, public, id_user } = req.body

        let name = req.body.name
        const isPublic = req.body.public
        const id_user = req.body.id_user

        // console.log(req.body)


        if (id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено редактировать чужой плейлист'
            })
        }

        const playlist = await Playlist.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        if (req.file && playlist.image && !playlist.image.includes('default')) {
            // const oldPath = path.resolve(playlist.image);
            // if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            deleteFile(playlist.image)
        }

        let imagePath = req.file 
            ? `uploads/covers/${req.file.filename}` 
            : playlist.image;

        const playlists = await Playlist.findAll({ where: {
            id_user: id_user,
        }}).catch((err) => {
            console.log(err)
        })

        if (!name || name.trim() == ''){
            name = 'Плейлист №' + playlists.length
        }

        playlist.name = name
        playlist.public = isPublic
        playlist.updated_at = Date.now()
        playlist.image = imagePath
        await playlist.save()

        console.log(name)


        return Response.success(res, 'Плейлист обновлен')
    }
    
    static async deletePlaylist(req, res){
        // const userId = req.body.id_user
        // console.log(req.body)

        const playlist = await Playlist.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        if (playlist.id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено удалять чужой плейлист'
            })
        }

        await playlist.destroy()

        deleteFile(playlist.image)

        return Response.success(res, 'Плейлист удален')
    }
}

export default PlaylistController