import Response from "../configs/response.js";
import db from "../models/index.js";
import { getFileUrl } from "../utils/fileHelper.js";

const Comment = db.comment;
const User = db.user;
const Song = db.song;
const Artist = db.artist;

class CommentController {
    static async getUserComments(req, res) {
        try {
            const id_user = req.userId;

            const comments = await Comment.findAll({
                where: { id_user: id_user },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatar']
                    },
                    {
                        model: Song,
                        as: 'song',
                        attributes: ['id', 'name', 'image'],
                        include: [
                            {
                                model: Artist,
                                as: 'artists',
                                attributes: ['id', 'name'],
                                through: { attributes: [] }
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            const formattedComments = comments.map(comment => {
                const commentJson = comment.toJSON();
                
                if (commentJson.user) {
                    commentJson.user.avatar = getFileUrl(commentJson.user.avatar, 'uploads/default/placeholder_avatar.jpg');
                }

                if (commentJson.song && commentJson.song.image) {
                    commentJson.song.image = getFileUrl(commentJson.song.image, 'uploads/default/placeholder.webp'); 
                }

                return commentJson;
            });

            return Response.success(res, "Ваши комментарии успешно получены", formattedComments);
        } catch (error) {
            console.error('Ошибка в getUserComments:', error);
            return res.status(500).json({ message: "Ошибка сервера при получении ваших комментариев", error: error.message });
        }
    }

    static async getSongComments(req, res) {
        try {
            const { id } = req.params;

            const comments = await Comment.findAll({
                where: { id_song: id },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatar']
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            const formattedComments = comments.map(comment => {
                const commentJson = comment.toJSON();
                if (commentJson.user) {
                    commentJson.user.avatar = getFileUrl(commentJson.user.avatar, 'uploads/default/placeholder_avatar.jpg');
                }
                return commentJson;
            });

            return Response.success(res, "Комментарии успешно получены", formattedComments);
        } catch (error) {
            console.error('Ошибка в getSongComments:', error);
            return res.status(500).json({ message: "Ошибка сервера при получении комментариев", error: error.message });
        }
    }

    static async addComment(req, res) {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const id_user = req.userId;

            if (!text || !text.trim()) {
                return res.status(400).json({ message: "Текст комментария не может быть пустым" });
            }

            const newComment = await Comment.create({
                text: text.trim(),
                id_song: id,
                id_user: id_user,
                created_at: new Date(),
                updated_at: new Date()
            });

            const commentWithUser = await Comment.findByPk(newComment.id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'avatar']
                    }
                ]
            });

            const commentJson = commentWithUser.toJSON();
            if (commentJson.user) {
                commentJson.user.avatar = getFileUrl(commentJson.user.avatar, 'uploads/default/placeholder_avatar.jpg');
            }

            return Response.success(res, "Комментарий успешно добавлен", commentJson);
        } catch (error) {
            console.error('Ошибка в addComment:', error);
            return res.status(500).json({ message: "Ошибка сервера при добавлении комментария", error: error.message });
        }
    }

    static async deleteComment(req, res) {
        try {
            const { id } = req.params;
            const id_user = req.userId;
            const role_name = req.userRole

            const comment = await Comment.findByPk(id);

            if (!comment) {
                return res.status(404).json({ message: "Комментарий не найден" });
            }

            const isAuthor = Number(comment.id_user) === Number(id_user);
            const isAdminOrModerator = role_name === 'Администратор' || role_name === 'Модератор'

            if (!isAuthor && !isAdminOrModerator) {
                return res.status(403).json({ message: "У вас нет прав на удаление этого комментария" });
            }

            await comment.destroy();

            return Response.success(res, "Комментарий успешно удален");
        } catch (error) {
            console.error('Ошибка в deleteComment:', error);
            return res.status(500).json({ message: "Ошибка сервера при удалении комментария", error: error.message });
        }
    }

    static async updateComment(req, res) {
        try {
            const { id } = req.params;
            const { text } = req.body;
            const id_user = req.userId;

            if (!text || !text.trim()) {
                return res.status(400).json({ message: "Текст комментария не может быть пустым" });
            }

            const comment = await Comment.findByPk(id);

            if (!comment) {
                return res.status(404).json({ message: "Комментарий не найден" });
            }

            if (Number(comment.id_user) !== Number(id_user)) {
                return res.status(403).json({ message: "Вы можете редактировать только свои комментарии" });
            }

            comment.text = text.trim();
            comment.updated_at = Date.now()
            await comment.save();

            const updatedComment = await Comment.findByPk(id, {
                include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }]
            });

            const commentJson = updatedComment.toJSON();
            if (commentJson.user) {
                commentJson.user.avatar = getFileUrl(commentJson.user.avatar, 'uploads/default/placeholder_avatar.jpg');
            }

            return Response.success(res, "Комментарий изменен", commentJson );
        } catch (error) {
            console.error('Ошибка в updateComment:', error);
            return res.status(500).json({ message: "Ошибка сервера при обновлении комментария", error: error.message });
        }
    }
}

export default CommentController;