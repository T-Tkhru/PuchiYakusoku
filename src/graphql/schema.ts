import { builder } from "@/lib/builder";
import { prisma } from "@/lib/prisma";
import { lexicographicSortSchema, printSchema } from "graphql";
import { writeFileSync } from "fs";
import path from "path";

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

const promise = builder.prismaObject("Promise", {
  fields: (t) => ({
    id: t.exposeID("id"),
    content: t.exposeString("content"),
    level: t.expose("level", { type: LevelEnum }),
    dueDate: t.expose("dueDate", { type: "DateTime" }),
    sender: t.relation("sender"),
    receiver: t.relation("receiver"),
    acceptedAt: t.expose("acceptedAt", { type: "DateTime" }),
    completedAt: t.expose("completedAt", { type: "DateTime" }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

export const user = builder.prismaObject("User", {
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
  }),
});

export const schema = builder.toSchema();

const schemaAsString = printSchema(lexicographicSortSchema(schema));
const schemaPath = path.join(process.cwd(), "src/generated/schema.graphql");
writeFileSync(schemaPath, schemaAsString);
