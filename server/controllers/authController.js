import { Op, Sequelize } from "sequelize"
import Response from "../configs/response.js"
import db from "../models/index.js"
import bcrypt from 'bcrypt'
import mailer from "../configs/nodemailer.js";
import jwt from 'jsonwebtoken'
import authConfig from "../configs/auth.config.js";

const Role = db.role
const User = db.user

class AuthController{
    
    static async login(req, res){
        try{
            const email = req.body.email;

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

            const password = req.body.password;
            const match = await bcrypt.compare(password, user.password)

            if (!match){
                return Response.unauthorized(res, 'Неверный пароль')
            }

            const token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: 86400,
            })

            // const roles = await user.getRoles()
            // const authorities = roles.map((role) => )

            // return Response.success(res, "Успех!")
            res.status(200).json({
                id: user.id,
                email: user.email,
                accessToken: token,
            })

        }
        catch(error){
            return Response.serverError(res, error.message)
        }




        res.errors = {};

        
        

        // const hash = await bcrypt.hash(password, 10)
        // console.log(hash)

        


        

        

        // console.log(match)
        // console.log(user.password)

        
    }

    static async logout(req, res){
        
    }

    static async register(req, res){
        try{
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

            const hashPassword = await bcrypt.hash(password, 10)

            const user = await User.create({
                username: username,
                email: email,
                password: hashPassword,
                id_role: 3, //пока так
            })

            //Нужно сделать подтверждение почты

            const message = {
                from: 'Test <music_app06@mail.ru>',
                to: req.body.email,
                subject: 'Успех!',
                text: 'Вы успешно зарегистрировались на сайте!'
            }

            mailer(message)

            return Response.success(res)

            
        }
        catch(error){
            return Response.serverError(res, error.message)
        }




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

        

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (user){
            return Response.unauthorized(res, 'Email занят другим пользователем')
        }

        
        
        


        
    }
}

export default AuthController