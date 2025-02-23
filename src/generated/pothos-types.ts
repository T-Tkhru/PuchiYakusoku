/* eslint-disable */
import type { Prisma, Promise, User } from "@prisma/client";
export default interface PrismaTypes {
    Promise: {
        Name: "Promise";
        Shape: Promise;
        Include: Prisma.PromiseInclude;
        Select: Prisma.PromiseSelect;
        OrderBy: Prisma.PromiseOrderByWithRelationInput;
        WhereUnique: Prisma.PromiseWhereUniqueInput;
        Where: Prisma.PromiseWhereInput;
        Create: {};
        Update: {};
        RelationName: "sender" | "receiver";
        ListRelations: never;
        Relations: {
            sender: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            receiver: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "sentPromises" | "receivedPromises";
        ListRelations: "sentPromises" | "receivedPromises";
        Relations: {
            sentPromises: {
                Shape: Promise[];
                Name: "Promise";
                Nullable: false;
            };
            receivedPromises: {
                Shape: Promise[];
                Name: "Promise";
                Nullable: false;
            };
        };
    };
}