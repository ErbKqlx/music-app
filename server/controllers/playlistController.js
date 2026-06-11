// import Response from "../configs/response.js"
// import User from "../models/User.js"
import { Op, Sequelize } from "sequelize"
import db from "../models/index.js"
import Response from "../configs/response.js"
import fs from 'fs';
import path from 'path';
import { deleteFile } from "../utils/filesystem.js";
import { getFileUrl } from "../utils/fileHelper.js";

// const User = db.user
const Playlist = db.playlist
const PlaylistsSongs = db.playlists_songs
const Song = db.song
const Artist = db.artist

const host = 'http://localhost:8080'

class PlaylistController{
    static async getPlaylists(req, res){
        const targetUserId = req.params.id;
        const currentUserId = req.userId;
        const currentUserRole = req.userRole;

        let accessCondition = [
            { public: true },
            { id_user: currentUserId }
        ];

        if (currentUserRole === 'Администратор' || currentUserRole === 'Модератор') {
            accessCondition.push({ public: false });
        }

        try {
            const playlists = await Playlist.findAll({ 
                where: {
                    id_user: targetUserId,
                    [Op.or]: accessCondition,
                },
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(*)
                                FROM playlists_songs AS ps
                                WHERE ps.id_playlist = "Playlists"."id"
                            )`),
                            'songs_count'
                        ]
                    ]
                },
                order: [['updated_at', 'DESC']]
            })

            const getTrackWord = (count) => {
                const num = Math.abs(count) % 100; 
                const lastDigit = num % 10;
                
                if (num > 10 && num < 20) return 'треков';
                if (lastDigit > 1 && lastDigit < 5) return 'трека';
                if (lastDigit === 1) return 'трек';
                return 'треков';
            };

            playlists.forEach(function(playlist){
                playlist.image = getFileUrl(playlist.image)

                const count = parseInt(playlist.getDataValue('songs_count')) || 0;
                playlist.setDataValue('songs_count', `${count} ${getTrackWord(count)}`);
            })

            return res.status(200).json({
                playlists
            })

        } catch(error){
            console.log(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
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
            if (req.userRole != 'Администратор' && req.userRole != 'Модератор'){
                return res.status(403).json({
                    errorMessage: 'Это приватный плейлист'
                })
            }
        }


        playlist.image = getFileUrl(playlist.image)
        
        
        const user = await playlist.getUser()

        const songs = await playlist.getSongs()

        const songsData = await Promise.all(
            songs.map(async song => {

                song.image = getFileUrl(song.image)

                song.song_url = `${host}/${song.song_url}`
                const artists = await song.getArtists()
            
                const artistsData = artists.map(artist => {
                    return {
                        id: artist.id,
                        name: artist.name,
                    }
                })

                return {
                    id: song.id,
                    name: song.name,
                    length: song.length,
                    artists: artistsData,
                    image: song.image,
                    song_url: song.song_url,
                    release_date: song.release_date,
                    lyrics: song.lyrics,
                    explicit_content: song.explicit_content,
                }
            })
        )

        console.log(songsData)

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


        if (id_user != req.userId && (req.userRole !== 'Администратор' || req.userRole !== 'Модератор')){
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
        const playlist = await Playlist.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        if (playlist.id_user != req.userId && (req.userRole !== 'Администратор' || req.userRole !== 'Модератор')){
            return res.status(403).json({
                errorMessage: 'Запрещено удалять чужой плейлист'
            })
        }

        deleteFile(playlist.image)

        await playlist.destroy()

        return Response.success(res, 'Плейлист удален')
    }

    static async deleteSongFromPlaylist(req, res){
        const playlist = await Playlist.findOne({ where: {
            id: req.params.id_playlist
        }}).catch((err) => {
            console.log(err)
        })

        if (!playlist) {
            return res.status(404).json({ errorMessage: 'Плейлист не найден' });
        }

        if (playlist.id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено удалять трек из чужого плейлиста'
            })
        }


        await playlist.removeSong(req.params.id_song);


        return Response.success(res, 'Трек удален из плейлиста')
    }

    static async addSongToPlaylist(req, res){
        const { id_playlist, id_song } = req.params;

        const playlist = await Playlist.findOne({ where: {
            id: id_playlist
        }}).catch((err) => {
            console.log(err)
        })

        if (!playlist) {
            return res.status(404).json({ errorMessage: 'Плейлист не найден' });
        }

        if (playlist.id_user != req.userId){
            return res.status(403).json({
                errorMessage: 'Запрещено добавлять трек в чужой плейлист'
            })
        }

        // const song = await Song.findByPk(id_song);
        // if (!song) {
        //     return res.status(404).json({ errorMessage: 'Указанный трек не найден' });
        // }

        // const hasSong = await playlist.hasSong(id_song);
        // if (hasSong) {
        //     return res.status(200).json({ message: 'Этот трек уже есть в плейлисте' });
        // }

        // await playlist.addSong(id_song);
        const [connection, created] = await PlaylistsSongs.findOrCreate({
            where: {
                id_playlist: id_playlist,
                id_song: id_song
            },
            defaults: {
                id_playlist: id_playlist,
                id_song: id_song
            }
        });

        if (!created) {
            return res.status(200).json({ 
                message: 'Трек уже находился в этом плейлисте'
            });
        }

        return Response.success(res, 'Трек добавлен в плейлист')
    }
}

export default PlaylistController