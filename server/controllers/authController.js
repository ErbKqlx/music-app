import { Op, Sequelize } from "sequelize"
import Response from "../configs/response.js"
import db from "../models/index.js"
import bcrypt from 'bcrypt'
import mailer from "../configs/nodemailer.js";
import jwt from 'jsonwebtoken'
import authConfig from "../configs/auth.config.js";

// const Role = db.role
const User = db.user

async function sendMail(code, email){
    const message = {
        from: 'Music App <music_app06@mail.ru>',
        to: email,
        subject: 'Код подтверждения регистрации',
        html: `
            <div style="font-family: sans-serif; text-align: center;">
                <h1>Ваш код подтверждения:</h1>
                <h2 style="color: #5577ee; letter-spacing: 5px; font-size: 32px;">${code}</h2>
                <p>Введите этот код на форме подтверждения почты, чтобы активировать аккаунт.</p>
            </div>
        `
    }

    await mailer(message)
}


class AuthController{
    
    static async login(req, res){
        try{
            // const errors = {}

            const { email, password } = req.body;

            const user = await User.findOne({
                where: {
                    email: email,
                }
            })

            if (!user){
                // errors.email = errors.email || [];
                // errors.password = errors.password || [];

                // errors.email.push('Неверный логин или пароль');
                // errors.password.push('Неверный логин или пароль');
                return Response.unauthorized(res, 'Неверный логин или пароль')
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match){
                // errors.email = errors.email || [];
                // errors.password = errors.password || [];

                // errors.email.push('Неверный логин или пароль');
                // errors.password.push('Неверный логин или пароль');
                console.log('a')
                return Response.unauthorized(res, 'Неверный логин или пароль')
            }

            // if (Object.keys(errors).length > 0) {
            //     return Response.badRequest(res, 'Неверный логин или пароль');
            // }

            if (!user.isActivated) {
                const code = Math.floor(100000 + Math.random() * 900000).toString();

                user.activationCode = code
                await user.save()

                sendMail(code, email)
                
                return Response.success(res, `Код отправлен на почту ${email}`, { isActivated: user.isActivated })
                // return Response.forbidden(res, 'Пожалуйста, подтвердите вашу почту');
            }

            const token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: 86400,
            })

            console.log(user)

            return Response.success(res, 'Вы вошли в аккаунт', {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                registration_date: user.registration_date,
                id_role: user.id_role,
                accessToken: token,
                isActivated: user.isActivated,
            })

        }
        catch(error){
            return Response.serverError(res, error.message)
        }

    }

    static async register(req, res){
        try{
            const errors = {}

            const { username, email, password } = req.body;

            const user = await User.findOne({ where: { email } })

            if (user){
                if (!user.isActivated){
                    await User.destroy({ where: { id: user.id } })
                }
                else{
                    errors.email = errors.email || []
                    errors.email.push('Email уже занят')
                }
            }

            if (password.length < 6) {
                errors.password = errors.password || [];
                errors.password.push('Пароль должен содержать минимум 6 символов');
            }

            if (!/[a-z]/i.test(password)) {
                errors.password = errors.password || [];
                errors.password.push('Пароль должен содержать хотя бы одну букву');
            }

            if (Object.keys(errors).length > 0) {
                return Response.badRequest(res, 'Ошибки валидации', errors);
            }

            const hashPassword = await bcrypt.hash(password, 10)

            const code = Math.floor(100000 + Math.random() * 900000).toString();

            await User.create({
                username: username,
                email: email,
                password: hashPassword,
                id_role: 3,
                activationCode: code,
                isActivated: false,
            })

            sendMail(code, email)

            return Response.success(res, `Код отправлен на почту ${email}`)
        }
        catch(error){
            return Response.serverError(res, error.message)
        }
    }

    static async verifyCode(req, res) {
        try {
            const { email, code } = req.body;
            
            const user = await User.findOne({ where: { email, activationCode: code } });

            if (!user) {
                return Response.forbidden(res, "Неверный код подтверждения");
            }

            user.isActivated = true;
            user.activationCode = null;
            await user.save();

            const token = jwt.sign({ id: user.id }, authConfig.secret, { 
                expiresIn: 86400 
            });

            return res.status(200).json({
                message: "Почта подтверждена!",
                accessToken: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    registration_date: user.registration_date,
                    id_role: user.id_role,
                    isActivated: user.isActivated,
                }
            });
        } catch (error) {
            return Response.serverError(res, error.message);
        }
    }
}

export default AuthController