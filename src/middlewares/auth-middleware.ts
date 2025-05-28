import { Request, Response, NextFunction } from "express";

/**
 * Middleware que simula autenticação.
 * Em um cenário real, o ID do usuário seria extraído de um token (ex: JWT).
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Simulação: usuário fixo id=1
  req.user = { id: 1 };
  next();
}