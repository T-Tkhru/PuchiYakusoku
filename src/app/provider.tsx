"use client";

import { ApolloProvider } from "@apollo/client";
import { Liff } from "@line/liff";
import { UIProvider } from "@yamada-ui/react";
import { useEffect, useState } from "react";

import { theme } from "@/app/theme";
import { GlobalContext } from "@/contexts/GlobalContext";
import { client } from "@/lib/apollo-client";

export const LIFFTemplate = ({ children }: { children: React.ReactNode }) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  // // Execute liff.init() when the app is initialized
  // useEffect(() => {
  //   import("@line/liff")
  //     .then((liff) => liff.default)
  //     .then((liff) => {
  //       console.log("LIFF init...");
  //       liff
  //         .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
  //         .then(() => {
  //           console.log("LIFF init succeeded.");
  //           setLiffObject(liff);
  //         })
  //         .catch((error: Error) => {
  //           console.log("LIFF init failed.");
  //           setLiffError(error.toString());
  //         });
  //     });
  // }, []);

  return (
    <UIProvider theme={theme}>
      {/* <GlobalContext.Provider
        value={{ liff: liffObject, liffError: liffError }}
      > */}
      <ApolloProvider client={client}>
        <div>{children}</div>
      </ApolloProvider>
      {/* </GlobalContext.Provider> */}
    </UIProvider>
  );
};
