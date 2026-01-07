import { getUsers } from "../services/userService.js"
import Response from "../configs/response.js"
import { StatusCode } from "../constants.js"

export async function handleGetUsers(req, res){
    try{
        const users = await getUsers()
        // res.status(200).json(users.rows)
        return Response.success(
            res,
            "Пользователи получены",
            StatusCode.OK
        )
    }
    catch(e){
        // return res.status(500).json({
        //     message: e.message
        // })
        return Response.serverError(
            res,
            "Ошибка в запросе",
            e
        )
    }
    // res.status(200).json({message: "Get all users"});
}

export async function handleCreateUser(req, res){
    // console.log(req.body)
    try{
        const {login, password, username, email, avatar} = req.body

        if (!login || !password || !username || !email){
            res.status(400);
            throw new Error('All fields are required!')
        }
        // res.status(201).send("Create new user");
        
        const newUser = await db
            .query('INSERT INTO users (login, password, username, email, avatar, id_role, registration_date) ' +
                'values ($1, $2, $3, $4, $5, (SELECT id FROM roles WHERE roles.name = $6), $7) RETURNING *',
                [login, password, username, email, avatar, 'Пользователь', '24.12.2025']
            );

        res.json(newUser.rows[0])
    }
    catch(e){
        return res.status(500).json({
            message: e.message
        })
    }
}    

export async function handleGetUser(req, res){
    const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id])
    res.status(200).json(user.rows[0]);
}

export async function handleUpdateUser(req, res){
    const {password, username, email, avatar} = req.body

    const user = await db.query(
        'UPDATE users SET password = $1, username = $2, email = $3, avatar = $4 ' +
        'WHERE id = $5 RETURNING *',
        [password, username, email, avatar, req.params.id]
    )
    res.status(200).json(user.rows[0]);
}

export async function handleDeleteUser(req, res){
    const user = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id])
    res.status(200).json(user.rows[0]);
}

// module.exports = { handleGetUsers, handleCreateUser, handleGetUser, handleUpdateUser, handleDeleteUser }