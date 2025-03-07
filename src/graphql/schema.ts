import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import path from "path";

import { builder } from "@/lib/builder";
import { prisma } from "@/lib/prisma";

const LevelEnum = builder.enumType("Level", {
  values: {
    LOW: { value: "LOW" },
    MEDIUM: { value: "MEDIUM" },
    HIGH: { value: "HIGH" },
  },
});

const createPromiseInput = builder.inputType("CreatePromiseInput", {
  fields: (t) => ({
    content: t.string({ required: true }),
    level: t.field({ type: LevelEnum, required: true }),
    dueDate: t.string({ required: false }),
    direction: t.boolean({ required: true }),
    isShare: t.boolean({ required: false }),
  }),
});

const createUserInput = builder.inputType("CreateUserInput", {
  fields: (t) => ({
    userId: t.string({ required: true }),
    displayName: t.string({ required: true }),
    pictureUrl: t.string({ required: true }),
  }),
});

const promise = builder.prismaObject("Promise", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    content: t.exposeString("content", { nullable: false }),
    level: t.expose("level", { type: LevelEnum, nullable: false }),
    dueDate: t.expose("dueDate", { type: "DateTime", nullable: true }),
    sender: t.relation("sender", { nullable: false }),
    receiver: t.relation("receiver"),
    direction: t.exposeBoolean("direction", { nullable: false }),
    isAccepted: t.exposeBoolean("isAccepted"),
    completedAt: t.expose("completedAt", { type: "DateTime" }),
    canceledAt: t.expose("canceledAt", { type: "DateTime", nullable: true }),
    isShare: t.exposeBoolean("isShare", { nullable: false }),
  }),
});

const user = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    userId: t.exposeString("userId", { nullable: false }),
    displayName: t.exposeString("displayName", { nullable: false }),
    pictureUrl: t.exposeString("pictureUrl"),
    sentPromises: t.relation("sentPromises"),
    receivedPromises: t.relation("receivedPromises"),
  }),
});

builder.queryType({
  fields: (t) => ({
    promises: t.field({
      type: [promise],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (_, __, context: any) => {
        const userId = context.get("user").userId;
        return prisma.promise.findMany({
          where: {
            sender: { userId: userId },
            isAccepted: !false,
            completedAt: null,
          },
        });
      },
    }),
    sentPromises: t.field({
      type: [promise],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (_, __, context: any) => {
        const userId = context.get("user").userId;
        return prisma.promise.findMany({
          where: {
            sender: { userId: userId },
            isAccepted: !false,
            OR: [
              { completedAt: { not: null } },
              {
                dueDate: {
                  gte: new Date(),
                },
              },
              {
                dueDate: null,
              },
            ],
          },
        });
      },
    }),
    receivedPromises: t.field({
      type: [promise],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (_, __, context: any) => {
        const userId = context.get("user").userId;
        return prisma.promise.findMany({
          where: {
            receiver: { userId: userId },
            isAccepted: !false,
            OR: [
              { completedAt: { not: null } },
              {
                dueDate: {
                  gte: new Date(),
                },
              },
              {
                dueDate: null,
              },
            ],
          },
        });
      },
    }),
    promise: t.field({
      type: promise,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        const foundPromise = await prisma.promise.findUnique({
          where: { id: args.id },
          include: { sender: true, receiver: true },
        });
        if (!foundPromise) {
          throw new Error("Promise not found");
        }
        return foundPromise;
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createPromise: t.field({
      type: promise,
      args: { input: t.arg({ type: createPromiseInput, required: true }) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (_, args, context: any) => {
        const userId = context.get("user").userId;
        console.log(context.get("user"));
        return prisma.promise.create({
          data: {
            content: args.input.content,
            level: args.input.level,
            dueDate: args.input.dueDate ? new Date(args.input.dueDate) : null,
            direction: args.input.direction,
            sender: { connect: { userId: userId } },
            isShare: args.input.isShare ?? false,
          },
        });
      },
    }),
    createUser: t.field({
      type: user,
      args: { input: t.arg({ type: createUserInput, required: true }) },
      resolve: (_, args) =>
        prisma.user.create({
          data: {
            userId: args.input.userId,
            displayName: args.input.displayName,
            pictureUrl: args.input.pictureUrl,
          },
        }),
    }),
    acceptPromise: t.field({
      type: promise,
      args: {
        id: t.arg.id({ required: true }),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: async (_, args, context: any) => {
        const promise = await prisma.promise.findUnique({
          where: { id: args.id },
        });
        if (!promise || promise === null) {
          throw new Error("Promise not found");
        } else if (promise.dueDate !== null && promise.dueDate < new Date()) {
          throw new Error("Promise is expired");
        }
        const userId = context.get("user").userId;
        return prisma.promise.update({
          where: { id: args.id },
          data: {
            receiver: { connect: { userId: userId } },
            isAccepted: true,
          },
        });
      },
    }),
    rejectPromise: t.field({
      type: promise,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_, args, context: any) => {
        const userId = context.get("user").userId;
        return prisma.promise.update({
          where: { id: args.id },
          data: {
            receiver: { connect: { userId: userId } },
            isAccepted: false,
          },
        });
      },
    }),
    completePromise: t.field({
      type: promise,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (_, args) => {
        const promise = await prisma.promise.findUnique({
          where: { id: args.id },
        });
        if (!promise || promise === null) {
          throw new Error("Promise not found");
        } else if (promise.dueDate !== null && promise.dueDate < new Date()) {
          throw new Error("Promise is expired");
        }
        return prisma.promise.update({
          where: { id: args.id },
          data: { completedAt: new Date() },
        });
      },
    }),
    cancelPromise: t.field({
      type: promise,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_, args) =>
        prisma.promise.update({
          where: { id: args.id },
          data: { canceledAt: new Date() },
        }),
    }),
    deletePromise: t.field({
      type: promise,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (_, args) =>
        prisma.promise.delete({
          where: { id: args.id },
        }),
    }),
  }),
});

export const schema = builder.toSchema();

const schemaAsString = printSchema(lexicographicSortSchema(schema));
if (process.env.NODE_ENV === "development") {
  const schemaPath = path.join(process.cwd(), "src/generated/schema.graphql");
  writeFileSync(schemaPath, schemaAsString);
}
