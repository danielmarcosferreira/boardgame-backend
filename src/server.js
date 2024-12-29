import e from "express";
import connection from "./database/database.js";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

const app = e();
app.use(cors());
app.use(e.json());

// app.post('/categories', postCategorie)
// app.get('/categories', getCategorie)

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running in port ${port}`));