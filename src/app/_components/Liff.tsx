"use client";

import { useGlobalContext } from "@/hooks/useGlobalContext";
import { FC, useEffect, useState } from "react";
import { Button, VStack, Text } from "@yamada-ui/react";

export const Liff: FC = () => {
  const { liff, liffError } = useGlobalContext();
  const [name, setName] = useState<string>("ユーザーデータなし");
  const [IDToken, setIDToken] = useState<string>("IDTokenなし");

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!liff) return;
        const profile = await liff.getProfile();
        setName(profile.displayName);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    };

    getProfile();
  }, [liff]);

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
      <Text>{name}</Text>
      <Text>{IDToken}</Text>
    </VStack>
  );
};
