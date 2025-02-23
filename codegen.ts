import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/generated/schema.graphql",
  documents: "src/app/**/*.gql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
