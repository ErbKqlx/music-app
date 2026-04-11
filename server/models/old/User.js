// const db = require('../db')

import { DataTypes, Sequelize } from "sequelize";
import jwt from "jsonwebtoken"
// import sequelize from "sequelize.js";

// const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/music_db')

export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            // login: {
            //     type: DataTypes.STRING,
            //     allowNull: true,
            //     unique: true,
            // },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'default'
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            avatar: {
                type: DataTypes.STRING,
            },
            id_role: {
                type: DataTypes.SMALLINT,
            },
            registration_date: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW
            }
        },
        {
            timestamps: false,
            tableName: 'users',
        }
    )

    return User
}


// ;(async () => {
//     await sequelize.sync({force: true})
// })()


// export default User