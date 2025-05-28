import express from "express";
import routerUsuario from "./routes/user-routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/usuario", routerUsuario);

export default app;