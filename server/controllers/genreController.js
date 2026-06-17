import Response from "../configs/response.js";
import db from "../models/index.js";

const Genre = db.genre

class GenreController{
    static async getOneGenre(req, res) {
        try {
            const { id } = req.params;

            const genre = await db.genre.findByPk(id, {
                attributes: ['id', 'name']
            });

            if (!genre) {
                return res.status(404).json({ errorMessage: 'Жанр не найден' });
            }

            return Response.success(res, "Данные жанра успешно получены", genre)

        } catch (error) {
            console.error('Ошибка при получении одного жанра:', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера при получении жанра' });
        }
    }

    static async getGenres(req, res){
        try {
            const genres = await Genre.findAll({
                order: [
                    ['name', 'ASC']
                ]
            });

            return Response.success(res, "Вывод всех жанров", genres)
            // return res.status(200).json(genres)
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }

    static async addGenre(req, res){
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Название жанра обязательно' });
        }

        const candidate = await Genre.findOne({ where: { name: name.trim() } });
        if (candidate) {
            return res.status(400).json({ success: false, message: 'Такой жанр уже существует' });
        }

        const newGenre = await Genre.create({ name: name.trim() });

        return res.status(201).json({
            success: true,
            data: newGenre
        });
    }

    static async updateGenre(req, res){
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({ success: false, message: 'Название жанра не может быть пустым' });
            }

            const genre = await Genre.findByPk(id);
            if (!genre) {
                return res.status(404).json({ success: false, message: 'Жанр не найден' });
            }

            const candidate = await Genre.findOne({ where: { name: name.trim() } });
            if (candidate) {
                return res.status(400).json({ success: false, message: 'Такой жанр уже существует' });
            }

            genre.name = name.trim();
            await genre.save();

            return res.status(200).json({
                success: true,
                data: genre
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }

    static async deleteGenre(req, res){
        try {
            const { id } = req.params;

            const genre = await Genre.findByPk(id);
            if (!genre) {
                return res.status(404).json({ success: false, message: 'Жанр не найден' });
            }

            await genre.destroy();

            // return res.status(200).json({
            //     success: true,
            //     message: 'Жанр успешно удален'
            // });

            return Response.success(res, 'Жанр успешно удален', genre)
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }
}

export default GenreController