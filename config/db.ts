import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    user: process.env.pg_usuario,
    password: process.env.pg_senha,
    host: process.env.pg_host,
    database: process.env.pg_database,
    port: Number(process.env.pg_port)
});