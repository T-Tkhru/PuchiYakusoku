import { Level, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ユーザーの作成
  const user1 = await prisma.user.create({
    data: {
      userId: "user1-line-id",
      displayName: "User One",
      pictureUrl: "https://example.com/user1.jpg",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      userId: "user2-line-id",
      displayName: "User Two",
      pictureUrl: "https://example.com/user2.jpg",
    },
  });

  // プロミスの作成
  await prisma.promise.create({
    data: {
      content: "Deliver a presentation",
      level: Level.HIGH,
      dueDate: new Date("2025-02-28T23:59:59Z"),
      direction: true,
      sender: { connect: { userId: user1.userId } },
    },
  });

  await prisma.promise.create({
    data: {
      content: "Complete the project report",
      level: Level.MEDIUM,
      dueDate: new Date("2025-03-15T23:59:59Z"),
      direction: true,
      sender: { connect: { userId: user1.userId } },
    },
  });

  console.log("Seed data created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
