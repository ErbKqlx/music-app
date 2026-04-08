import Response from "../configs/response.js"
import db from "../models/index.js"

const ROLES = db.ROLES
const User = db.user

const checkDuplicateEmail = async (req, res, next) => {
    try{
        let user = await User.findOne({ where: {
            email: req.body.email
        }})

        console.log(user)

        if (user){
            return Response.error(res, "Email занят!")
        }

        next()
    }
    catch (error){
        return Response.serverError(res, error.message)
    }
}

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles){
        for (const role of req.body.roles){
            if (!ROLES.includes(role)){
                return Response.error(res, `Такой роли не существует: ${role}`)
            }
        }
    }

    next()
}

const verifySignUp = {
    checkDuplicateEmail, 
    checkRolesExisted,
}

export default verifySignUp