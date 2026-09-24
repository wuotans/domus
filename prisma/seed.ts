import { PrismaClient, Role, TransactionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@domus.local" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@domus.local",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const categories = [
    ["Água", TransactionType.EXPENSE],
    ["Energia", TransactionType.EXPENSE],
    ["Manutenção", TransactionType.EXPENSE],
    ["Funcionários", TransactionType.EXPENSE],
    ["Limpeza", TransactionType.EXPENSE],
    ["Segurança", TransactionType.EXPENSE],
    ["Taxa condominial", TransactionType.INCOME],
    ["Multas e juros", TransactionType.INCOME],
    ["Outras receitas", TransactionType.INCOME],
    ["Outras despesas", TransactionType.EXPENSE],
  ] as const;

  for (const [name, type] of categories) {
    await prisma.category.upsert({
      where: { name },
      update: { type },
      create: { name, type },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
