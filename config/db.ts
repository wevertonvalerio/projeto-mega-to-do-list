import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config(
    {
        path: path.resolve(__dirname, "../.env")
    }
);

export const pool = new Pool({
    user: process.env.pg_usuario,
    password: process.env.pg_senha,
    host: process.env.pg_host,
    database: process.env.pg_database,
    port: Number(process.env.pg_port)
});