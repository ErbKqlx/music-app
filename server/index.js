// import express from "express"
// import router from "./routes/userRoutes"
import express, { json } from 'express';
import router from './routes/index.js';
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url';
// const dotenv = require("dotenv");
// const errorHandler = require('./middleware/errorHandler');
// const db = require('./configs/db')

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
app.use(json())
// app.use("/api", require('./routes/userRoutes'));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))
app.use("/api", router);
// app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})