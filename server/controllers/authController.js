import { Op } from "sequelize"
import Response from "../configs/response.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import mailer from "../configs/nodemailer.js";

class AuthController{
    static async login(req, res){
        res.errors = {};

        const email = req.body.login_email;
        const password = req.body.password;

        // const hash = await bcrypt.hash(password, 10)
        // console.log(hash)

        const user = await User.findOne({
            where: {
                // [Op.or]: {
                //     login: req.body.login_email,
                //     email: req.body.login_email
                // }
                email: email,
            }
        })


        if (!user){
            return Response.notFound(res, 'Пользователь не найден')
        }

        const match = await bcrypt.compare(password, user.password)

        console.log(match)
        console.log(user.password)

        if (match){
            return Response.success(res, 'Пользователь найден')
        }
        else{
            return Response.unauthorized(res, 'Неверный пароль')
        }
    }

    static async logout(req, res){
        
    }

    static async register(req, res){
        const message = {
            from: 'Test <laney80@ethereal.email>',
            to: req.body.email,
            subject: 'Успех!',
            text: 'Вы успешно зарегистрировались на сайте!'
        }

        mailer(message)

        return Response.success(res)
    }
}

export default AuthController