"use client";

import { Button, Text, VStack } from "@yamada-ui/react";
import { FC, useEffect } from "react";

import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useLiff } from "@/hooks/useLiff";

export const Liff: FC = () => {
  const { liff, liffError } = useGlobalContext();
  const { loginLiff, user } = useLiff();

  useEffect(() => {
    loginLiff();
  }, [liff, loginLiff]);

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
          // if (!liff) return;
          // liff.login();
          // liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(() => {
          //   liff.getIDToken();
          //   console.log("liff login");
          // });
          loginLiff();
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
          if (!liff) return;
          liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(() => {
            if (!liff.isLoggedIn()) {
              liff.login();
            }
            liff
              .shareTargetPicker(
                [
                  {
                    type: "text",
                    text: "Hello, World!",
                  },
                ],
                {
                  isMultiple: true,
                }
              )
              .then(function (res) {
                if (res) {
                  // succeeded in sending a message through TargetPicker
                  console.log(`[${res.status}] Message sent!`);
                } else {
                  // sending message canceled
                  console.log("TargetPicker was closed!");
                }
              })
              .catch(function (error) {
                alert(error);
                console.log("something wrong happen");
              });
          });
        }}
      >
        shareTargetPicker
      </Button>
      <Text>{user?.displayName}</Text>
      <Text>{user?.pictureUrl}</Text>
    </VStack>
  );
};
