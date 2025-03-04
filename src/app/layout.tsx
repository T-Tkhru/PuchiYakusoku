"use client";
import { Box, Container } from "@yamada-ui/react";

import { Provider } from "./provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        <Provider>
          <Container
            w="full"
            minH="100vh"
            alignItems="center"
            p="0"
            backgroundColor="red.50"
          >
            <Box w="100%" maxW="480px" backgroundColor="#FFFFFF" minH="100vh">
              {children}
            </Box>
          </Container>
        </Provider>
      </body>
    </html>
  );
}
