import Express from "express";
import { 
    cadastrarUsuario,
    logarUsuario
} from "../controllers/user-controller";

const routerUsuario = Express.Router();

routerUsuario.post("/cadastro", cadastrarUsuario);
routerUsuario.post("/", logarUsuario);

export default routerUsuario;