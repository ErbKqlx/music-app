import authConfig from "../configs/auth.config.js"
import Response from "../configs/response.js"
import db from "../models/index.js"
import jwt from 'jsonwebtoken'

const User = db.user

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"]

    if (!token){
        return Response.forbidden(res, "Нет токена!")
    }

    const actualToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token

    jwt.verify(actualToken, authConfig.secret, (err, decoded) => {
        if (err){
            return Response.unauthorized(res)
        }

        req.userId = decoded.id
        next()
    })
}

const authJwt = {
    verifyToken,
}

export default authJwt