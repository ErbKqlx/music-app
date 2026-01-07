const { Pool } = require('pg')

const db = new Pool({
    user: 'postgres',
    password: '1111',
    host: 'localhost',
    port: 5432,
    database: 'music_db'
})

module.exports = db