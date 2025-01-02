import e from "express";
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

import categoriesRouter from "./routes/categories.routes.js"
import gamesRouter from "./routes/games.routes.js"
import customersRouter from "./routes/customers.routes.js"
import rentalsRouter from "./routes/rentals.routes.js"

const app = e();
app.use(cors());
app.use(e.json());

app.use(categoriesRouter)
app.use(gamesRouter)
app.use(customersRouter)
app.use(rentalsRouter)

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running in port ${port}`));