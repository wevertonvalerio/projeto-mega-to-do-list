import dotenv from "dotenv";
dotenv.config();

import app from "./app";

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});