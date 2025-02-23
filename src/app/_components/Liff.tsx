"use client";

import { Button, Text, VStack } from "@yamada-ui/react";
import { FC } from "react";

// import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useLiff } from "@/hooks/useLiff";

export const Liff: FC = () => {
  // const { liff, liffError } = useGlobalContext();
  const { setupMockLiff, user, sendShareText, setCurrentLiff } = useLiff();

  return (
    <VStack>
      {liff && <Text>LIFF init succeeded.</Text>}
      {liffError && (
        <>
          <Text>LIFF init failed.</Text>
          <Text>
            <code>{liffError}</code>
          </Text>
        </>
      )}
      <Button
        onClick={() => {
          if (!liff) return;
          liff.login();
          liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(() => {
            liff.getIDToken();
            console.log("liff login");
          });
          setCurrentLiff(liff);
          // loginLiff();
        }}
      >
        liffログイン
      </Button>
      <Button
        onClick={() => {
          if (!liff) return;
          liff
            .sendMessages([
              {
                type: "text",
                text: "Hello, World!",
              },
            ])
            .then(() => {
              console.log("message sent");
            })
            .catch((err) => {
              alert(err);
              console.log("error", err);
            });
        }}
      >
        send messages
      </Button>
      <Button
        onClick={() => {
          setupMockLiff()
        }}
      >
        開発者モード
      </Button>
      <Button
        onClick={() => {
          sendShareText("お疲れ様です");
        }}
      >
        shareTargetPicker
      </Button>
      <Text>{user?.displayName}</Text>
      <Text>{user?.pictureUrl}</Text>
    </VStack>
  );
};
