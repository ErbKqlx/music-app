import { Op } from "sequelize"
import db from "../models/index.js"
import Response from "../configs/response.js"
import { getFileUrl } from "../utils/fileHelper.js"

const User = db.user
const Song = db.song
const Artist = db.artist

// const host = 'http://localhost:8080/'

class SearchController{
    static async search(req, res){
        try {
            const query = req.query.q;

            if (!query) {
                return res.json({ songs: [], artists: [], users: [] });
            }

            const [rawSongs, rawArtists, rawUsers] = await Promise.all([
                Song.findAll({
                    where: {
                        name: { [Op.iLike]: `%${query}%` }
                    },
                    include: [{
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] }
                    }],
                    limit: 10
                }),
                Artist.findAll({
                    where: {
                        name: { [Op.iLike]: `%${query}%` }
                    },
                    limit: 10
                }),
                User.findAll({
                    where: {
                        username: { [Op.iLike]: `%${query}%` }
                    },
                    attributes: { exclude: ['password'] },
                    limit: 10
                })
            ]);


            const songs = rawSongs.map(song => {
                const songData = song.toJSON();
                songData.image = getFileUrl(songData.image);
                
                if (songData.artists) {
                    songData.artists = songData.artists.map(artist => ({
                        ...artist,
                        image: getFileUrl(artist.image, 'uploads/default/placeholder_avatar.jpg')
                    }));
                }
                return songData;
            });

            const artists = rawArtists.map(artist => {
                const artistData = artist.toJSON();
                artistData.image = getFileUrl(artistData.image, 'uploads/default/placeholder_avatar.jpg');
                return artistData;
            });

            const users = rawUsers.map(user => {
                const userData = user.toJSON();
                console.log(userData.avatar)
                userData.avatar = getFileUrl(userData.avatar, 'uploads/default/placeholder_avatar.jpg');
                console.log(userData.avatar)
                return userData;
            });

            res.json({ songs, artists, users });
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }
}

export default SearchController