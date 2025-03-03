"use client";

import { ApolloProvider } from "@apollo/client";
import { UIProvider } from "@yamada-ui/react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Suspense } from "react";

import { theme } from "@/app/theme";
import { client } from "@/lib/apollo-client";

import { LiffProvider } from "./providers/LiffProvider";
import { PromiseNavigator } from "./providers/promiseNavigator";


export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LiffProvider>
      <ApolloProvider client={client}>
        <Suspense fallback={null}>
          <PromiseNavigator>
            <UIProvider theme={theme}>
              <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
            </UIProvider>
          </PromiseNavigator>
        </Suspense>
      </ApolloProvider>
    </LiffProvider>
  );
};
