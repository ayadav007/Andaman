import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: path.join(process.cwd(), "dev.db") }),
});

async function main() {
  const exists = await prisma.homeSection.findFirst({ where: { type: "blog_teaser" } });
  if (exists) {
    console.log("blog_teaser already exists");
    return;
  }
  const n = await prisma.homeSection.count();
  await prisma.homeSection.create({
    data: { type: "blog_teaser", titleEn: "From the travel guide", sortOrder: n, visible: true },
  });
  console.log("blog_teaser added");
}

main()
  .finally(() => prisma.$disconnect());
