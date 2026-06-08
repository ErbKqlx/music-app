import db from "../models/index.js"
import fs from 'fs';
import { getFileUrl } from "../utils/fileHelper.js";
import { deleteFile } from "../utils/filesystem.js";
import Response from "../configs/response.js"
import { col, fn, literal, Op } from "sequelize";


// const Playlist = db.playlist
// const PlaylistsSongs = db.playlists_songs
const Song = db.song
const Artist = db.artist
const SongsHistories = db.songs_histories

const host = 'http://localhost:8080'

class SongController{
    static async getOneSong(req, res){
        const song = await Song.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })


        song.image = getFileUrl(song.image)

        if (song.song_url && fs.existsSync(song.song_url)) {
            song.song_url = `${host}/${song.song_url}`;
        } else {
            song.song_url = null;
        }
        
        const artists = await song.getArtists()
        const artistsData = artists.map(artist => {
            artist.image = getFileUrl(artist.image, 'uploads/default/placeholder_avatar.jpg')

            return {
                id: artist.id,
                id_user: artist.id_user,
                name: artist.name,
                bio: artist.bio,
            }
        })

        const genresData = await song.getGenres()

        return res.status(200).json({
            data: {
                id: song.id,
                name: song.name,
                length: song.length,
                artists: artistsData,
                image: song.image,
                song_url: song.song_url,
                release_date: song.release_date,
                explicit_content: song.explicit_content,
                lyrics: song.lyrics,
                genres: genresData,
            }
        })
    }

    static async createSong(req, res) {
        try {
            const { name, length, release_date, explicit_content, lyrics, genres, artists } = req.body;

            const imageFile = req.files?.['image']?.[0];
            const songFile = req.files?.['song_url']?.[0];

            const imagePath = imageFile ? imageFile.path.replace(/\\/g, '/') : null;
            const songPath = songFile ? songFile.path.replace(/\\/g, '/') : null;

            const newSong = await Song.create({
                name: name,
                length: length ? parseInt(length, 10) : 0,
                release_date: release_date || new Date(),
                explicit_content: explicit_content === '1' || explicit_content === 'true',
                lyrics: lyrics || '',
                image: imagePath,
                song_url: songPath
            });

            if (genres) {
                const genresIds = Array.isArray(genres) ? genres : [genres];
                await newSong.setGenres(genresIds); 
            }

            let artistsIds = [];
            if (artists) {
                artistsIds = Array.isArray(artists) ? artists.map(Number) : [Number(artists)];
            }

            const currentArtist = await Artist.findOne({ where: { id_user: req.userId } });

            if (currentArtist) {
                const creatorArtistId = Number(currentArtist.id);
                if (!artistsIds.includes(creatorArtistId)) {
                    artistsIds.push(creatorArtistId);
                }
            }
            
            await newSong.setArtists(artistsIds);

            return res.status(201).json({
                message: "Трек успешно создан",
                data: {
                    id: newSong.id,
                    name: newSong.name,
                    length: newSong.length,
                    image: newSong.image,
                    song_url: newSong.song_url,
                    release_date: newSong.release_date,
                    lyrics: newSong.lyrics
                }
            });

        } catch (error) {
            console.error('Ошибка при создании трека в БД:', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера при создании трека' });
        }
    }

    static async updateSong(req, res){
        try {
            const { id } = req.params;
            const { name, length, release_date, explicit_content, lyrics, genres, artists } = req.body;

            const song = await Song.findByPk(id);
            if (!song) {
                return res.status(404).json({ errorMessage: 'Трек не найден' });
            }

            if (req.userRole !== 'Администратор') {
                const artists = await song.getArtists();
                
                const isOwner = artists.some(artist => Number(artist.id_user) === Number(req.userId));

                if (!isOwner) {
                    return res.status(403).json({
                        errorMessage: 'Запрещено редактировать чужой трек'
                    });
                }
            }

            if (name) song.name = name;
            if (length) song.length = parseInt(length, 10);
            if (release_date) song.release_date = release_date;
            if (explicit_content !== undefined) song.explicit_content = explicit_content === '1';
            if (lyrics !== undefined) song.lyrics = lyrics;

            if (req.files?.['image']?.[0]) {
                deleteFile(song.image)
                song.image = req.files['image'][0].path.replace(/\\/g, '/');
            }
            if (req.files?.['song_url']?.[0]) {
                song.song_url = req.files['song_url'][0].path.replace(/\\/g, '/');
            }

            if (genres) {
                const genresIds = Array.isArray(genres) ? genres : [genres];
                await song.setGenres(genresIds); 
            }

            let artistsIds = [];
            if (artists) {
                artistsIds = Array.isArray(artists) ? artists.map(Number) : [Number(artists)];
            }

            const currentArtist = await Artist.findOne({ where: { id_user: req.userId } });

            if (currentArtist) {
                const creatorArtistId = Number(currentArtist.id);
                if (!artistsIds.includes(creatorArtistId)) {
                    artistsIds.push(creatorArtistId);
                }
            }
            
            await song.setArtists(artistsIds);

            await song.save();

            return res.status(200).json({
                message: "Трек успешно обновлен",
                data: song
            });

        } catch (error) {
            console.error('Ошибка при обновлении трека в БД:', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера при обновлении трека' });
        }
    }

    static async deleteSong(req, res){
        try {
            const { id } = req.params;

            const song = await Song.findByPk(id);
            if (!song) {
                return res.status(404).json({ errorMessage: 'Трек не найден' });
            }

            if (req.userRole !== 'Администратор' && req.userRole !== 'Модератор') {
                const artists = await song.getArtists();
                
                const isOwner = artists.some(artist => Number(artist.id_user) === Number(req.userId));

                if (!isOwner) {
                    return res.status(403).json({
                        errorMessage: 'Запрещено удалять чужой трек'
                    });
                }
            }

            deleteFile(song.image)
            deleteFile(song.song_url)



            await song.destroy();

            return res.status(200).json({
                message: "Трек успешно удален",
                // data: song
            });

        } catch (error) {
            console.error('Ошибка при удалении трека: ', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера при удалении трека' });
        }
    }

    static async getNewSongs(req, res){
        try {
            const newSongs = await Song.findAll({
                attributes: ['id', 'name', 'length', 'release_date', 'explicit_content', 'image', 'song_url'],
                
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] },
                        attributes: ['id', 'name']
                    }
                ],
                
                order: [
                    ['release_date', 'DESC'],
                    ['id', 'DESC']
                ],
                
                limit: 15 
            });

            newSongs.map(song => {
                song.image = getFileUrl(song.image)
                song.song_url = getFileUrl(song.song_url)
            })

            return Response.success(res, "Новые треки", newSongs)
        } catch (error) {
            console.error('Ошибка при получении новых треков:', error);
            // return Response.
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }

    }

    static async trackListen(req, res){
        try {
            const songId = req.params.id;

            const userId = req.userId

            const song = await Song.findByPk(songId);
            if (!song) {
                return res.status(404).json({ status: "error", message: "Песня не найдена" });
            }

            await SongsHistories.create({
                id_song: songId,
                id_user: userId,
                listened_at: new Date()
            });

            return res.status(201).json({
                status: "success",
                message: "Прослушивание успешно зарегистрировано"
            });
        } catch (error) {
            console.error('Ошибка при фиксации прослушивания:', error);
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }
    }

    static async getPopularSongs(req, res){
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const dateString = oneWeekAgo.toISOString()

            const listensCountSubquery = `(
                SELECT COUNT(*)
                FROM public.songs_histories AS history
                WHERE history.id_song = "Songs"."id"
                AND history.listened_at >= '${dateString}'
            )`;

            const popularSongs = await Song.findAll({
                attributes: [
                    'id', 'name', 'length', 'release_date', 'explicit_content', 'image', 'song_url',
                    [
                        literal(listensCountSubquery),
                        'weekly_listens_count'
                    ]
                ],
                where: literal(`${listensCountSubquery} > 0`),
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] },
                        attributes: ['id', 'name']
                    }
                ],
                order: [
                    [literal('weekly_listens_count'), 'DESC'],
                    ['id', 'DESC']
                ],
                limit: 20
            });

            popularSongs.map(song => {
                song.image = getFileUrl(song.image)
                song.song_url = getFileUrl(song.song_url)
            })

            return Response.success(res, "Популярные треки за неделю", popularSongs)
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }
    }

    static async getSongsHistory(req, res){
        try {
            const songsHistory = await SongsHistories.findAll({
                where: {
                    id_user: req.userId
                },
                order: [
                    ['listened_at', 'DESC']
                ],
                limit: 5,
                include: ['song']
            })

            const uniqueSongsMap = new Map();

            songsHistory.map(historyItem => {
                    const song = historyItem.song;

                    if (song && !uniqueSongsMap.has(song.id)){
                        song.image = getFileUrl(song.image)
                        uniqueSongsMap.set(song.id, song)
                    }
                    
                    
                    return song;
                })
                .filter(Boolean);

            const songs = Array.from(uniqueSongsMap.values());

            return Response.success(res, "История прослушанных треков", songs);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }
    }
}

export default SongController