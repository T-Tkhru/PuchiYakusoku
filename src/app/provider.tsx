"use client";

import { ApolloProvider } from "@apollo/client";
import { UIProvider } from "@yamada-ui/react";

import { theme } from "@/app/theme";
import { client } from "@/lib/apollo-client";

export const LIFFTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <UIProvider theme={theme}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UIProvider>
  );
};
