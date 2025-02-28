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
    dueDate: t.string({ required: true }),
    direction: t.boolean({ required: true }),
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
    dueDate: t.expose("dueDate", { type: "DateTime", nullable: false }),
    sender: t.relation("sender", { nullable: false }),
    receiver: t.relation("receiver"),
    direction: t.exposeBoolean("direction", { nullable: false }),
    isAccepted: t.exposeBoolean("isAccepted"),
    completedAt: t.expose("completedAt", { type: "DateTime" }),
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
      args: {
        senderId: t.arg.string({ required: true }),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (_, __, context: any) => {
        const userId = context.get("user").userId;
        return prisma.promise.findMany({
          where: { sender: { userId: userId } },
        });
      },
    }),
    receivedPromises: t.field({
      type: [promise],
      args: {
        receiverId: t.arg.string({ required: true }),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (_, __, context: any) => {
        const userId = context.get("user").userId;
        return prisma.promise.findMany({
          where: { receiver: { userId: userId } },
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
        });
        if (!foundPromise) {
          throw new Error("Promise not found");
        }
        return foundPromise;
      },
    }),
    userByUserId: t.field({
      type: user,
      nullable: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: async (_, __, context: any) => {
        const userId = context.get("user").userId;
        const foundUser = await prisma.user.findUnique({
          where: { userId: userId },
        });
        return foundUser;
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
            dueDate: new Date(args.input.dueDate),
            direction: args.input.direction,
            sender: { connect: { userId: userId } },
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
        if (!promise || promise.dueDate < new Date()) {
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
      resolve: (_, args) =>
        prisma.promise.update({
          where: { id: args.id },
          data: { receiver: { disconnect: true }, isAccepted: false },
        }),
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
        if (!promise || promise.dueDate < new Date()) {
          throw new Error("Promise is expired");
        }
        return prisma.promise.update({
          where: { id: args.id },
          data: { completedAt: new Date() },
        });
      },
    }),
  }),
});

export const schema = builder.toSchema();

const schemaAsString = printSchema(lexicographicSortSchema(schema));
if (process.env.NODE_ENV === "development") {
  const schemaPath = path.join(process.cwd(), "src/generated/schema.graphql");
  writeFileSync(schemaPath, schemaAsString);
}
