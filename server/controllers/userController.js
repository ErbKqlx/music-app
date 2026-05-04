import Response from "../configs/response.js"
import { StatusCode } from "../constants.js"
import db from "../models/index.js"
// import User from "../models/Users.js"
import { Sequelize } from "sequelize"

const User = db.user
class UserController{
    static async getUserData(req, res){
        // return Response.success(res, 'Профиль')
        const userId = req.params.id

        const user = await User.findByPk(userId)

        console.log(user.avatar)

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            id_role: user.id_role,
            registration_date: user.registration_date,
        })
    }
}

export default UserController