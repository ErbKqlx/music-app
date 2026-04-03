import { Op, Sequelize } from "sequelize"
import Response from "../configs/response.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import mailer from "../configs/nodemailer.js";

class AuthController{
    static async login(req, res){
        res.errors = {};

        const email = req.body.email;
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
        const errors = {
            username: {
                errors: []
            },
            email: {
                errors: []
            },
            password: {
                errors: []
            },
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (user){
            return Response.unauthorized(res, 'Email занят другим пользователем')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            id_role: 3, //пока так
        })


        const message = {
            from: 'Test <music_app06@mail.ru>',
            to: req.body.email,
            subject: 'Успех!',
            text: 'Вы успешно зарегистрировались на сайте!'
        }

        mailer(message)

        return Response.success(res)
    }
}

export default AuthController