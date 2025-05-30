import { sequelize } from "../database/migrations";
import { User } from "../models/user-model";
import { Transaction } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const tokenBlacklist = new Set<string>(); // tokens inválidos (logout)

export class UserService {
  /**
   * Cria um novo usuário com senha criptografada.
   * @param nome - Nome do usuário.
   * @param senha - Senha do usuário.
   * @returns Usuário criado (sem senha).
   */
  static async criarUsuario(nome: string, senha: string) {
    return await sequelize.transaction(async (t: Transaction) => {
      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await User.create(
        { nome, senha: senhaHash },
        { transaction: t }
      );

      return { id: novoUsuario.id, nome: novoUsuario.nome };
    });
  }

  /**
   * Realiza login, comparando a senha e retornando um token JWT.
   * @param nome - Nome do usuário.
   * @param senha - Senha em texto plano.
   * @returns Token JWT se válido.
   */
  static async loginUsuario(nome: string, senha: string) {
    const usuario = await User.findOne({ where: { nome } });
    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha inválida");

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return { token };
  }

  /**
   * Invalida um token, simulando o logout.
   * @param token - Token JWT a ser invalidado.
   */
  static logoutUsuario(token: string) {
    tokenBlacklist.add(token);
  }

  /**
   * Verifica se o token está inválido (usado por middleware).
   * @param token - Token JWT.
   * @returns true se inválido (logout).
   */
  static isTokenInvalidado(token: string): boolean {
    return tokenBlacklist.has(token);
  }

  /**
   * Exclui um usuário com base no ID.
   * @param userId - ID do usuário.
   * @returns true se excluído, false se não encontrado.
   */
  static async excluirUsuario(userId: number): Promise<boolean> {
    return await sequelize.transaction(async (t) => {
      const deletado = await User.destroy({
        where: { id: userId },
        transaction: t,
      });
      return deletado > 0;
    });
  }
}