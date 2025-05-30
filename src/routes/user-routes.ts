import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { autenticarToken } from "../middlewares/auth-middleware";
import { validarRequisicao } from "../middlewares/validation-middleware";
import { body } from "express-validator";

const router = Router();

// Cadastro - validar nome e senha antes
router.post(
  "/register",
  [
    body("nome").notEmpty().withMessage("Nome é obrigatório"),
    body("senha").isLength({ min: 6 }).withMessage("Senha deve ter ao menos 6 caracteres"),
    validarRequisicao
  ],
  UserController.cadastrarUsuario
);

// Login - validar nome e senha antes
router.post(
  "/login",
  [
    body("nome").notEmpty().withMessage("Nome é obrigatório"),
    body("senha").notEmpty().withMessage("Senha é obrigatória"),
    validarRequisicao
  ],
  UserController.logarUsuario
);

// Logout - só token
router.post("/logout", autenticarToken, UserController.logoutUsuario);

// Excluir usuário - só token
router.delete("/delete", autenticarToken, UserController.excluirUsuario);

export default router;