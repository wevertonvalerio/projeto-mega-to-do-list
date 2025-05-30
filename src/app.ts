import express from "express";
import routerUsuario from "./routes/user-routes";
import routerTarefa from "./routes/task-routes";
import "./models/user-model";  // Importa o modelo User para registrar no Sequelize
import "./models/task-model";  // Importa o modelo Task para registrar no Sequelize
import { initialize } from "./database/migrations"; 
import dotenv from "dotenv";

dotenv.config();  // Carrega variáveis de ambiente do arquivo .env
const app = express(); // Cria a aplicação Express, que será nosso servidor HTTP
app.use(express.json()); // Permite que o servidor processe requisições com corpo no formato JSON

app.use("/usuario", routerUsuario);
app.use("/tarefa", routerTarefa);

// Inicializa o banco de dados, criando as tabelas caso não existam ainda
initialize();

// Faz o servidor escutar a porta 3000 (http://localhost:3000)
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

// Exporta o app para ser utilizado em outros arquivos, por exemplo, para testes automatizados
export default app;