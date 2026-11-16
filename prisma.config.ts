import { definePrismaConfig } from "prisma/config"
import { defineConfig } from "@prisma/orm-postgres/config"

const connection = process.env.DATABASE_URL
if (!connection) throw new Error("DATABASE_URL is required")

export default definePrismaConfig({
  skills: { check: false },
  orm: defineConfig({
    contract: "./src/prisma/contract.prisma",
    db: { connection },
  }),
})
