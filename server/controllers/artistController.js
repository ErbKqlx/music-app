import Response from "../configs/response.js";
import db from "../models/index.js";
import { literal } from "sequelize";
import { getFileUrl } from "../utils/fileHelper.js";

const Artist = db.artist;
const Song = db.song;
const User = db.user;

class ArtistController {
    static async getArtist(req, res) {
        try {
            const { id } = req.params;

            const listensCountSubquery = `(
                SELECT COUNT(*)
                FROM public.songs_histories AS history
                WHERE history.id_song = "songs"."id"
            )`;

            const topSongsIdsSubquery = `(
                SELECT "id_song" 
                FROM public."songs_artists"
                WHERE "id_artist" = ${Number(id)}
                ORDER BY (
                    SELECT COUNT(*) 
                    FROM public.songs_histories AS history 
                    WHERE history.id_song = "id_song"
                ) DESC
                LIMIT 5
            )`;

            const artistData = await Artist.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['avatar']
                    },
                    {
                        model: Song,
                        as: 'songs',
                        attributes: [
                            'id', 'name', 'image', 'release_date', 'length', 'explicit_content', 'song_url',
                            [literal(listensCountSubquery), 'listens_count']
                        ],
                        where: {
                            id: {
                                [db.Sequelize.Op.in]: literal(topSongsIdsSubquery)
                            }
                        },
                        through: { attributes: [] },
                        required: false
                    },
                ],
                order: [[literal(listensCountSubquery), 'DESC']]
            });

            if (!artistData) {
                return res.status(404).json({
                    success: false,
                    message: 'Исполнитель не найден'
                });
            }

            const topSongs = artistData.songs || [];
            topSongs.forEach(song => {
                song.image = getFileUrl(song.image);
                song.song_url = getFileUrl(song.song_url);
            });

            return Response.success(
                res, 
                "Вывод исполнителя", 
                {
                    id: artistData.id,
                    name: artistData.name,
                    bio: artistData.bio || null,
                    image: getFileUrl(artistData.user.avatar, 'uploads/default/placeholder_avatar.jpg'), 
                    topSongs: topSongs,
                }
            );

        } catch (error) {
            console.error('Ошибка в getArtist контроллере:', error);
            return res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
}

export default ArtistController;