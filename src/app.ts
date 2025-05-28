import express from "express";
import { TaskController } from "./controllers/task-controller";
import routerUsuario from "./routes/user-routes";
import { authMiddleware } from "./middlewares/auth-middleware";
import { initialize } from "./database/migrations";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(authMiddleware);

app.post("/tasks", TaskController.createTask);
app.get("/tasks", TaskController.getAllTasks);
app.put("/tasks/:id", TaskController.updateTask);
app.delete("/tasks/:id", TaskController.deleteTask);
app.delete("/tasks/completed", TaskController.deleteCompletedTasks);
app.use("/usuario", routerUsuario);

initialize();

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

export default app;