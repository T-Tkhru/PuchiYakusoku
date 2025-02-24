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
    senderId: t.string({ required: true }),
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
    id: t.exposeID("id"),
    content: t.exposeString("content"),
    level: t.expose("level", { type: LevelEnum }),
    dueDate: t.expose("dueDate", { type: "DateTime" }),
    sender: t.relation("sender"),
    receiver: t.relation("receiver"),
    isAccepted: t.exposeBoolean("isAccepted"),
    completedAt: t.expose("completedAt", { type: "DateTime" }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

const user = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    userId: t.exposeString("userId"),
    displayName: t.exposeString("displayName"),
    pictureUrl: t.exposeString("pictureUrl"),
    sentPromises: t.relation("sentPromises"),
    receivedPromises: t.relation("receivedPromises"),
  }),
});

builder.queryType({
  fields: (t) => ({
    promises: t.field({
      type: [promise],
      resolve: () => prisma.promise.findMany(),
    }),
    sentPromises: t.field({
      type: [promise],
      args: {
        senderId: t.arg.string({ required: true }),
      },
      resolve: (_, args) =>
        prisma.promise.findMany({ where: { senderId: args.senderId } }),
    }),
    receivedPromises: t.field({
      type: [promise],
      args: {
        receiverId: t.arg.string({ required: true }),
      },
      resolve: (_, args) =>
        prisma.promise.findMany({ where: { receiverId: args.receiverId } }),
    }),
    promise: t.field({
      type: promise,
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: (_, args) =>
        prisma.promise.findUnique({
          where: { id: args.id },
        }),
    }),
    userByUserId: t.field({
      type: user,
      nullable: true,
      args: {
        userId: t.arg.string({ required: true }),
      },
      resolve: (_, args) =>
        prisma.user.findUnique({
          where: { userId: args.userId },
        }),
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createPromise: t.field({
      type: promise,
      args: { input: t.arg({ type: createPromiseInput, required: true }) },
      resolve: (_, args) =>
        prisma.promise.create({
          data: {
            content: args.input.content,
            level: args.input.level,
            dueDate: new Date(args.input.dueDate),
            senderId: args.input.senderId,
          },
        }),
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
        receiverId: t.arg.string({ required: true }),
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
          data: { receiverId: args.receiverId, isAccepted: true },
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
          data: { receiverId: null, isAccepted: false },
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
const schemaPath = path.join(process.cwd(), "src/generated/schema.graphql");
writeFileSync(schemaPath, schemaAsString);
