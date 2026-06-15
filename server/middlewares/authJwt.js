import authConfig from "../configs/auth.config.js"
import Response from "../configs/response.js"
import db from "../models/index.js"
import jwt from 'jsonwebtoken'

const User = db.user
const Role = db.role

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"]

    if (!token){
        return Response.forbidden(res, "Нет токена!")
    }

    const actualToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token

    jwt.verify(actualToken, authConfig.secret, async (err, decoded) => {
        if (err){
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ message: "Срок токена истек", code: "TOKEN_EXPIRED" });
            }
            return Response.unauthorized(res, "Неверный токен");
        }

        try {
            const user = await User.findByPk(decoded.id, {
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['name']
                }],
                attributes: ['id', 'is_banned']
            });

            if (!user) {
                return Response.unauthorized(res, "Пользователь не найден в системе");
            }

            if (user.is_banned) {
                return Response.forbidden(res, "Ваш аккаунт заблокирован");
            }

            req.userId = decoded.id;
            req.userRole = decoded.role; 
            
            next();
        } catch (dbError) {
            console.error("Ошибка проверки бана в verifyToken:", dbError);
            return Response.serverError(res, "Ошибка безопасности при проверке аккаунта");
        }
    })
}

const checkRole = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.userRole){
            return Response.forbidden(res, "Роль пользователя не определена");
        }

        if (!allowedRoles.includes(req.userRole)) {
            return Response.forbidden(res, "Доступ запрещен: недостаточно прав");
        }

        next()
    }
}

const authJwt = {
    verifyToken,
    checkRole,
}

export default authJwt