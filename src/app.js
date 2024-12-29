import e from "express";
import connection from "./database/database.js";

const app = e()
app.use(e.json())

app.listen(4000, () => console.log('Server is running in port 4000'));