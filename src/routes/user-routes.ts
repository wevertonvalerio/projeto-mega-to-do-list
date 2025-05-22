import Express from "express";
import { 
    cadastrarUsuario,
    logarUsuario
} from "../controllers/user-controller";

const router = Express.Router();

router.post("/cadastro", cadastrarUsuario);
router.post("/", logarUsuario);

export default router;