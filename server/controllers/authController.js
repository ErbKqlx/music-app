import { Op } from "sequelize"
import Response from "../configs/response.js"
import User from "../models/User.js"

class AuthController{
    static async login(req, res){
        const user = await User.findOne({
            where: {
                // [Op.or]: {
                //     login: req.body.login_email,
                //     email: req.body.login_email
                // }
                email: req.body.login_email,
                password: req.body.password,
            }
        })

        // console.log(req.body)
        console.log(user === null)

        if (!user){
            return Response.notFound(res, 'Пользователь не найден')
        }
        else{
            return Response.success(res, 'Пользователь найден')
        }
    }

    static async logout(req, res){
        
    }

    static async register(req, res){

    }
}

export default AuthController