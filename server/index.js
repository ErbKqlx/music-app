// import express from "express"
// import router from "./routes/userRoutes"
import express, { json } from 'express';
import router from './routes/index.js';
import cors from 'cors'
// const dotenv = require("dotenv");
// const errorHandler = require('./middleware/errorHandler');
// const db = require('./configs/db')

const app = express()

app.use(cors())
app.use(json())
// app.use("/api", require('./routes/userRoutes'));
app.use("/api", router);
// app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})