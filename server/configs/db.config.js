import { Pool } from 'pg'

const config = new Pool({
    USER: 'postgres',
    PASSWORD: '1111',
    HOST: 'localhost',
    PORT: 5432,
    DATABASE: 'music_db',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
})

// module.exports = db
export default config