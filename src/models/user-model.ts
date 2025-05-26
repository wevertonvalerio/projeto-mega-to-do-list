import { pool } from "../../config/db";
import { User } from "../interfaces/user-interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const criarUsuario = async (nome: string, senha: string) => {

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
        "INSERT INTO usuarios (nome, senha) VALUES ($1, $2) RETURNING id, nome",
        [nome, senhaHash]
    );
    return result.rows[0];
}

export const loginUsuario = async (nome: string, senha: string) => {

    const result = await pool.query(
        "SELECT * FROM usuarios WHERE nome = $1",
        [nome]
    );

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error("Senha Inválida!!!");
    }

    const token = jwt.sign(
        {
        id: usuario.id,
        nome: usuario.nome
        },
        process.env.JWT_SECRET as string,
        {
            expiresIn: "1h",
        }
    );
    return { token };
}