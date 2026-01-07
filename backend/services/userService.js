import { db } from "../configs/db.js"

async function getUsers(){
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

