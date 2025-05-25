import dotenv from "dotenv";

dotenv.config();

export const key = process.env.JWT_SECRET as String;