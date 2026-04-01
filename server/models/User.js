// const db = require('../db')

import { DataTypes, Sequelize } from "sequelize";
// import sequelize from "sequelize.js";

const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/music_db')

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
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
// ;(async () => {
//     await sequelize.sync({force: true})
// })()

// console.log(User === sequelize.models.User)


export default User