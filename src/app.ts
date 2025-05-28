import express from "express";
import { TaskController } from "./controllers/task-controller";
import { authMiddleware } from "./middlewares/auth-middleware";
import { initialize } from "./database/migrations";

const app = express();
app.use(express.json());
app.use(authMiddleware);

app.post("/tasks", TaskController.createTask);
app.get("/tasks", TaskController.getAllTasks);
app.put("/tasks/:id", TaskController.updateTask);
app.delete("/tasks/:id", TaskController.deleteTask);
app.delete("/tasks/completed", TaskController.deleteCompletedTasks);

initialize();

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});