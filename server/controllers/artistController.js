import Response from "../configs/response.js";
import db from "../models/index.js";

const Artist = db.artist
const Song = db.song

class ArtistController{
    static async getArtist(req, res){
        try {
            const { id } = req.params;

            const artistData = await Artist.findByPk(id, {
                include: [
                    {
                        model: Song,
                        as: 'songs',
                        attributes: ['id', 'name', 'image', 'release_date', 'length'], 
                        limit: 5,
                        order: [['listens', 'DESC']]
                    },
                ]
            });

            if (!artistData) {
                return res.status(404).json({
                    success: false,
                    message: 'Исполнитель не найден'
                });
            }

            return Response.success(
                res, 
                "Вывод исполнителя", 
                {
                    id: artistData.id,
                    name: artistData.name,
                    image: artistData.image,
                    bio: artistData.bio || null,

                    topSongs: artistData.songs || [],
                }
            )

            return res.status(200).json({
                success: true,
                
            });

        } catch (error) {
            console.error('Ошибка в getArtist контроллере:', error);
            return res.status(500).json({
                success: false,
                message: 'Внутренняя ошибка сервера'
            });
        }
    }
}

export default ArtistController