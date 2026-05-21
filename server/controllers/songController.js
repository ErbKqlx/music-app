import db from "../models/index.js"
import fs from 'fs';
import { getFileUrl } from "../utils/fileHelper.js";
import { deleteFile } from "../utils/filesystem.js";

// const Playlist = db.playlist
// const PlaylistsSongs = db.playlists_songs
const Song = db.song
// const Artist = db.artist

const host = 'http://localhost:8080'

class SongController{
    static async getOneSong(req, res){
        const song = await Song.findOne({ where: {
            id: req.params.id
        }}).catch((err) => {
            console.log(err)
        })

        // if (song.image) {
        //     if (fs.existsSync(song.image)) {
        //         song.image = `${host}/${song.image}`;
        //     } else {
        //         song.image = `${host}/uploads/default/placeholder.jpg`;
        //     }
        // } else {
        //     song.image = `${host}/uploads/default/placeholder.jpg`;
        // }

        song.image = getFileUrl(song.image)

        if (song.song_url && fs.existsSync(song.song_url)) {
            song.song_url = `${host}/${song.song_url}`;
        } else {
            song.song_url = null;
        }
        
        const artists = await song.getArtists()
        const artistsData = artists.map(artist => {
            artist.image = getFileUrl(artist.image, 'uploads/default/placeholder_avatar.jpg')
            // artist.image = `${host}/${artist.image}`

            return {
                id: artist.id,
                name: artist.name,
                image: artist.image,
                bio: artist.bio,
            }
        })

        // const songData = await Promise.all(
        //     songs.map(async song => {
        //         song.image = `http://localhost:8080/${song.image}`
        //         const artists = await song.getArtists()
            
        //         const artistsData = artists.map(artist => {
        //             return {
        //                 id: artist.id,
        //                 name: artist.name,
        //             }
        //         })
        //         return {
        //             id: song.id,
        //             name: song.name,
        //             length: song.length,
        //             artists: artistsData,
        //             image: song.image,
        //         }
        //     })
        // )

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
            }
        })
    }

    static async createSong(req, res){
        try {
            const { name, length, release_date, explicit_content, lyrics } = req.body;

            const imageFile = req.files?.['image']?.[0];
            const songFile = req.files?.['song_url']?.[0];

            const imagePath = imageFile ? imageFile.path.replace(/\\/g, '/') : null;
            const songPath = songFile ? songFile.path.replace(/\\/g, '/') : null;

            const newSong = await Song.create({
                name: name,
                length: length ? parseInt(length, 10) : 0,
                release_date: release_date || new Date(),
                explicit_content: explicit_content === '1',
                lyrics: lyrics || '',
                image: imagePath,
                song_url: songPath
            });

            // const userStoreId = req.body.id_user;
            // const artist = await db.artist.findOne({ where: { id_user: userStoreId } });
            // if (artist) { await newSong.addArtist(artist); }

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
            const { name, length, release_date, explicit_content, lyrics } = req.body;

            const song = await Song.findByPk(id);
            if (!song) {
                return res.status(404).json({ errorMessage: 'Трек не найден' });
            }

            if (name) song.name = name;
            if (length) song.length = parseInt(length, 10);
            if (release_date) song.release_date = release_date;
            if (explicit_content !== undefined) song.explicit_content = explicit_content === '1';
            if (lyrics !== undefined) song.lyrics = lyrics;

            if (req.files?.['image']?.[0]) {
                song.image = req.files['image'][0].path.replace(/\\/g, '/');
            }
            if (req.files?.['song_url']?.[0]) {
                song.song_url = req.files['song_url'][0].path.replace(/\\/g, '/');
            }

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

            // if (song.image) {
            //     if (fs.existsSync(song.image)) {
            //         fs.unlinkSync(song.image);
            //     }
            // }

            deleteFile(song.image)
            deleteFile(song.song_url)

            // if (song.song_url) {
            //     if (fs.existsSync(song.song_url)) {
            //         fs.unlinkSync(song.song_url);
            //     }
            // }

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
}

export default SongController