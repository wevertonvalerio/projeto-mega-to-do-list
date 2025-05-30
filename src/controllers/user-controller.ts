import { Request, Response } from "express";
import { UserService } from "../services/user-service";
import { getAuthenticatedUserId, getTokenFromRequest } from "../utils/auth-utils";

/**
 * Controlador responsável por lidar com as requisições HTTP relacionadas ao usuário,
 * como cadastro, login, logout e exclusão.
 */
export class UserController {

  /**
   * Método para cadastrar um novo usuário.
   * - Recebe nome e senha no corpo da requisição.
   * - Chama o modelo para criar o usuário.
   * - Retorna status 201 e os dados do usuário criado.
   * @param req Objeto da requisição HTTP (contém dados enviados pelo cliente).
   * @param res Objeto da resposta HTTP (usado para enviar a resposta ao cliente).
   */
  static async cadastrarUsuario(req: Request, res: Response): Promise<void> {
    try {
      // Extrai os dados do corpo da requisição
      const { nome, senha } = req.body;

      // Chama o serviço para criar o usuário no banco
      const usuario = await UserService.criarUsuario(nome, senha);

      // Retorna status 201 (criado) com mensagem e dados do usuário
      res.status(201).json({
        message: "Usuário criado com sucesso!",
        usuario
      });

    } catch {
      // Em caso de erro interno, retorna status 500 com mensagem de erro
      res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
  }

  /**
   * Método para autenticar um usuário (login).
   * - Recebe nome e senha no corpo da requisição.
   * - Chama o modelo para validar e gerar token JWT.
   * - Retorna status 200 com token se sucesso, ou 401 se erro.
   * @param req Objeto da requisição HTTP.
   * @param res Objeto da resposta HTTP.
   */
  static async logarUsuario(req: Request, res: Response): Promise<void> {
    try {
      // Extrai nome e senha do corpo da requisição
      const { nome, senha } = req.body;

      // Chama o modelo para realizar login e obter token JWT
      const { token } = await UserService.loginUsuario(nome, senha);

      // Retorna status 200 com mensagem e token de autenticação
      res.status(200).json({
        message: "Login realizado com sucesso!",
        token
      });

    } catch (error: any) {
      // Se ocorrer erro (usuário não encontrado ou senha inválida), retorna 401
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Método para realizar logout do usuário.
   * - Invalida o token JWT para impedir seu uso futuro.
   * @param req Objeto da requisição HTTP.
   * @param res Objeto da resposta HTTP.
   */
  static async logoutUsuario(req: Request, res: Response): Promise<void> {
    try {
      // Extrai o token JWT do cabeçalho Authorization
      const token = getTokenFromRequest(req);
      if (!token) {
        res.status(400).json({ error: "Token não fornecido" });
        return;
      }

      // Invalida o token usando o serviço
      UserService.logoutUsuario(token);

      // Retorna status 200 com mensagem de logout
      res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch {
      res.status(500).json({ error: "Erro ao realizar logout" });
    }
  }

  /**
   * Método para excluir o usuário autenticado.
   * - Usa o ID do usuário obtido via autenticação (token).
   * - Chama o serviço para excluir o usuário do banco.
   * @param req Objeto da requisição HTTP.
   * @param res Objeto da resposta HTTP.
   */
  static async excluirUsuario(req: Request, res: Response): Promise<void> {
    try {
      // Obtém o ID do usuário autenticado
      const userId = getAuthenticatedUserId(req, res);
      if (!userId) return; // Caso não autenticado, o middleware já responde

      // Chama o serviço para excluir o usuário
      const sucesso = await UserService.excluirUsuario(userId);

      if (!sucesso) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      // Retorna status 204 (sem conteúdo) após exclusão
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  }
}