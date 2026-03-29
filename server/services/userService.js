import db from "../configs/db.js"

export async function getUsers(){
    // const connection = await db
    // console.log(1)
    const users = await db.query('SELECT * FROM users')
    return users
}

export async function createUser(){

}

export async function getUser(){
    
}

export async function updateUser(){
    
}

export async function deleteUser(){
    
}

