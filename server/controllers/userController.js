import Response from "../configs/response.js"
import { StatusCode } from "../constants.js"
import db from "../models/index.js"
// import User from "../models/Users.js"
import { Sequelize } from "sequelize"
import { getFileUrl } from "../utils/fileHelper.js"
import { deleteFile } from "../utils/filesystem.js"

const User = db.user
const Role = db.role
const Artist = db.artist

class UserController{
    static async getUsers(req, res){
        try {
            const users = await User.findAll({
                order: [
                    ['username', 'ASC']
                ]
            });

            return Response.success(res, "Вывод всех пользователей", users)
            // return res.status(200).json(genres)
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка сервера ' + error);
        }
    }

    static async getUserData(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ errorMessage: 'Пользователь не найден' });
            }

            user.avatar = getFileUrl(user.avatar, 'uploads/default/placeholder_avatar.jpg');

            const artistProfile = await db.artist.findOne({
                where: { id_user: user.id },
                attributes: ['id']
            });

            return res.status(200).json({
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                id_role: user.id_role,
                role_name: user.role?.name,
                registration_date: user.registration_date,
                artistId: artistProfile ? artistProfile.id : null
            });
        } catch (error) {
            console.error('Ошибка в getUserData:', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера' });
        }
    }

    static async updateUserData(req, res) {
        try {
            const { username } = req.body;
            const targetUserId = req.params.id;

            if (targetUserId != req.userId && req.userRole !== 'Администратор' && req.userRole !== 'Модератор') {
                return res.status(403).json({
                    errorMessage: 'Запрещено редактировать чужой профиль'
                });
            }

            if (!username || username.trim() === '') {
                return res.status(400).json({ errorMessage: 'Имя пользователя не может быть пустым' });
            }

            const user = await User.findOne({ 
                where: { id: targetUserId },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                }]
            });
            if (!user) {
                return res.status(404).json({ errorMessage: 'Пользователь не найден' });
            }

            if (req.file) {
                if (user.avatar) {
                    deleteFile(user.avatar); 
                }
                user.avatar = `uploads/avatars/${req.file.filename}`;
            } 

            user.username = username.trim();
            await user.save();

            console.log(`Профиль пользователя ${user.username} обновлен в БД`);

            const fullAvatarUrl = getFileUrl(user.avatar, 'uploads/default/placeholder_avatar.jpg');

            return Response.success(res, 'Профиль успешно обновлен', {
                user: {
                    id: user.id,
                    username: user.username,
                    avatar: fullAvatarUrl,
                    role_name: user.role_name,
                    email: user.email,
                    id_role: user.id_role,
                    role_name: user.role?.name,
                    registration_date: user.registration_date,
                }
            });

        } catch (error) {
            console.error('Критическая ошибка в updateUserData:', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера при обновлении профиля' });
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { id_role } = req.body;

            if (!id_role) {
                return Response.badRequest(res, "ID роли не указан");
            }

            const user = await User.findByPk(id);
            if (!user) {
                return Response.notFound(res, "Пользователь не найден");
            }

            if (Number(id_role) === 1) {
                return Response.forbidden(res, "Нельзя назначить роль Администратора");
            }

            user.id_role = id_role;
            await user.save();

            const updatedUser = user.toJSON();
            delete updatedUser.password;

            return Response.success(res, "Роль пользователя успешно изменена", updatedUser);

        } catch (error) {
            console.error("Ошибка в updateUserRole:", error);

            return res.status(500).json({ message: 'Ошибка сервера при обновлении роли', error: error.message });
        }
    }
}

export default UserController