import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import { DateTimeResolver } from "graphql-scalars";

import type PrismaTypes from "@/generated/pothos-types";
import { prisma } from "@/lib/prisma";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});
