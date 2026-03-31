import { Op } from "sequelize"
import Response from "../configs/response.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'

class AuthController{
    static async login(req, res){
        // const { email, password } = req.body
        const email = req.body.login_email;
        const password = req.body.password;

        // const hashPassword = await bcrypt.hash(password, 10)
        //const match = bcrypt.compare(password, hashPassword)
        
        // console.log(hashPassword)

        const user = await User.findOne({
            where: {
                // [Op.or]: {
                //     login: req.body.login_email,
                //     email: req.body.login_email
                // }
                email: email,
            }
        })

        // console.log(user.password)
        const match = await bcrypt.compare(password, user.password)

        console.log(match)
        // console.log(hashPassword)
        console.log(user.password)
        // console.log(req.body)
        // console.log(user === null)

        if (!user){
            return Response.notFound(res, 'Пользователь не найден')
        }
        else{
            if (match){
                return Response.success(res, 'Пользователь найден')
            }
            else{
                return Response.unauthorized(res, 'Неверный пароль')
            }
        }
    }

    static async logout(req, res){
        
    }

    static async register(req, res){

    }
}

export default AuthController