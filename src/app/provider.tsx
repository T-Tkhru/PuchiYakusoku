"use client";

import { ApolloProvider } from "@apollo/client";
import { UIProvider } from "@yamada-ui/react";

import { theme } from "@/app/theme";
import { client } from "@/lib/apollo-client";

import { LiffProvider } from "./providers/LiffProvider";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UIProvider theme={theme}>
      <LiffProvider>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </LiffProvider>
    </UIProvider>
  );
};
