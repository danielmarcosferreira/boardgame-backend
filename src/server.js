import e from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

import categoriesRouter from "./routes/categories.routes.js"

const app = e();
app.use(cors());
app.use(e.json());
app.use(categoriesRouter)

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running in port ${port}`));