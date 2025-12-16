import { defineConfig } from "@prisma/internals";
import "dotenv/config";

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
