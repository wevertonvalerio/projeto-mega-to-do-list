import { Router } from "express";
import {
  criarTask,
  listarTask,
  atualizarTask,
  deletarTask
} from "../controllers/task-controller";
import { autenticarToken } from "../middlewares/auth-middleware";

const routerTasks = Router();

routerTasks.use(autenticarToken);

routerTasks.post("/criarTask", criarTask);
routerTasks.get("/", listarTask);
routerTasks.put("/:id", atualizarTask);
routerTasks.delete("/:id", deletarTask);

export default routerTasks;