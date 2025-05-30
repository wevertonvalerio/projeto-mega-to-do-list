import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { key } from "../../config/jwt"; // Chave secreta para JWT
import { tokenBlacklist } from "../services/user-service";

// Extende a interface Request do Express para adicionar a propriedade 'user'
export interface AuthRequest extends Request {
  user?: any; // Pode armazenar os dados do usuário extraídos do token
}

/**
 * Middleware para autenticar e validar o token JWT enviado no cabeçalho Authorization.
 * 
 * Fluxo:
 * 1. Pega o token do header Authorization (formato esperado: "Bearer <token>").
 * 2. Se não existir token, responde com 401.
 * 3. Verifica a validade do token com jwt.verify.
 * 4. Se inválido, responde com 403.
 * 5. Se válido, adiciona o objeto do usuário decodificado em req.user.
 * 6. Chama next() para continuar o processamento da requisição.
 */
export const autenticarToken: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Pega o cabeçalho Authorization (pode ser undefined)
  const authHeader = req.headers["authorization"];

  // Separa o token do prefixo 'Bearer'
  const token = authHeader && authHeader.split(" ")[1];

  // Se não existir token, responde com status 402 (não autorizado)
  if (!token) {
    res.status(402).json({ error: "Token não fornecido." });
    return; // Encerra aqui a execução
  }

  // Verifica se o token é válido, usando a chave secreta
  jwt.verify(token, key, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Token inválido." });
      return; // Encerra aqui a execução
    }

    // Se o token é válido, adiciona os dados do usuário na requisição
    req.user = user;
    next(); // Continua para o próximo middleware/rota
  });
};