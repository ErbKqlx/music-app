import Response from "../configs/response.js"
import { StatusCode } from "../constants.js"
import db from "../models/index.js"
// import User from "../models/Users.js"
import { Sequelize } from "sequelize"
import { getFileUrl } from "../utils/fileHelper.js"
import { deleteFile } from "../utils/filesystem.js"

const User = db.user

class UserController{
    static async getUserData(req, res){
        // return Response.success(res, 'Профиль')
        const userId = req.params.id

        const user = await User.findByPk(userId)

        // console.log(user.avatar)
        user.avatar = getFileUrl(user.avatar, 'uploads/default/placeholder_avatar.jpg')

        // console.log()

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            id_role: user.id_role,
            registration_date: user.registration_date,
        })
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

            const user = await User.findOne({ where: { id: targetUserId } });
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
                    registration_date: user.registration_date,
                }
            });

        } catch (error) {
            console.error('Критическая ошибка в updateUserData:', error);
            return res.status(500).json({ errorMessage: 'Внутренняя ошибка сервера при обновлении профиля' });
        }
    }
}

export default UserController