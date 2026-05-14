import { Op } from "sequelize"
import db from "../models/index.js"
import Response from "../configs/response.js"

const User = db.user
const Song = db.song
const Artist = db.artist

const host = 'http://localhost:8080/'

class SearchController{
    static async search(req, res){
        try {
            const query = req.query.q;

            if (!query) {
                return res.json({ songs: [], artists: [], users: [] });
            }

            const [songs, artists, users] = await Promise.all([
                Song.findAll({
                    where: {
                        name: { [Op.iLike]: `%${query}%` }
                    },
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

            console.log(songs)

            res.json({ songs, artists, users });
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }
}

export default SearchController