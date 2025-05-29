import { Request, Response } from "express";

// Função que verifica se o usuário está autenticado e retorna o ID dele, ou responde com erro 401
export function getAuthenticatedUserId(req: Request, res: Response): number | null {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Não autorizado" });
    return null;
  }

  return userId;
}
