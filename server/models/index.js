import { Sequelize } from "sequelize";
import pg from 'pg';
import User from "./Users.js";
import Role from "./Roles.js";
import Playlist from "./Playlists.js"
import PlaylistsSongs from "./PlaylistsSongs.js";
import Song from "./Songs.js"
import initModels from "./init-models.js";
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

const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/music_db', {
  dialect: 'postgres',
  dialectModule: pg
})
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

const models = initModels(sequelize)

db.user = models.Users
db.role = models.Roles
db.playlist = models.Playlists
db.playlists_songs = models.PlaylistsSongs
db.song = models.Songs

// db.role.belongsToMany(db.user, { through: })

// db.ROLES = ["Пользователь", "Администратор", "Модератор"]

export default db

// export default sequelize