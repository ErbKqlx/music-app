import { Sequelize } from "sequelize";
import User from "./User.js";
import Role from "./Role.js";
// import config from "../configs/db.config";

// const sequelize = new Sequelize(
//     config.DATABASE, 
//     config.USER,
//     config.PASSWORD,
//     {
//         host: config.HOST,
//         dialect: config.dialect,
//         pool: {
//             max: config.pool.max,
//             min: config.pool.min,
//             acquire: config.pool.acquire,
//             idle: config.pool.idle
//         }
//     }
// )

// // const db = {}

// // db.Sequelize = Sequelize
// // db.sequelize = sequelize

const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/music_db')
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = User(sequelize, Sequelize)
db.role = Role(sequelize, Sequelize)
db.playlist = Playlist(sequelize, Sequelize)

// db.role.belongsToMany(db.user, { through: })

db.ROLES = ["Пользователь", "Администратор", "Модератор"]

export default db

// export default sequelize