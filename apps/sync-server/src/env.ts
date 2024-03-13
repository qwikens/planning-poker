import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().positive().int().default(8080),
  DATABASE_PATH: z.string().default("db.sqlite"),
});

export const env = envSchema.parse(process.env);
