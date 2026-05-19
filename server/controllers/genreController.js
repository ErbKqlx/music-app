import db from "../models/index.js";

const Genre = db.genre

class GenreController{
    static async getGenres(req, res){
        try {
            const genres = await Genre.findAll();

            return res.status(200).json(genres)
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }
}

export default GenreController