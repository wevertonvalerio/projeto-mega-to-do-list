import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { key } from "../../config/jwt";

export interface AuthRequest extends Request {
    user?: any;
}

export const autenticarToken: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).send(
      { 
        error: "Token não fornecido!!!" 
      }
    );
    return;
  }

  jwt.verify(token, key, (err, user) => {
    if (err) {
      res.status(403).send(
        { 
          error: "Token inválido!!!" 
        }
      );
    }
    req.user = user;
    next();
  });
};