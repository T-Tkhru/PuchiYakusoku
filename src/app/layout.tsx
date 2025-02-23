"use client";
import { ApolloProvider } from "@apollo/client";
import { UIProvider } from "@yamada-ui/react";
import { LiffProvider } from "./providers/LiffProvider";
import { theme } from "@/app/theme";
import { client } from "@/lib/apollo-client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        <ApolloProvider client={client}>
          <UIProvider theme={theme}>
            <LiffProvider>{children}</LiffProvider>
          </UIProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
