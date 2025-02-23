"use client";

import { Button, Text, VStack } from "@yamada-ui/react";
import { FC } from "react";

// import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useLiff } from "@/hooks/useLiff";

export const Liff: FC = () => {
  // const { liff, liffError } = useGlobalContext();
  const { currentLiff, user, sendShareText, getProfile } = useLiff();

  return (
    // <VStack>
    //   <Button
    //     onClick={() => {
    //       if (!currentLiff) return;
    //       currentLiff
    //         .sendMessages([
    //           {
    //             type: "text",
    //             text: "Hello, World!",
    //           },
    //         ])
    //         .then(() => {
    //           console.log("message sent");
    //         })
    //         .catch((err) => {
    //           alert(err);
    //           console.log("error", err);
    //         });
    //     }}
    //   >
    //     send messages
    //   </Button>
    //   <Button
    //     onClick={() => {
    //       sendShareText("お疲れ様です");
    //     }}
    //   >
    //     shareTargetPicker
    //   </Button>
    //   <Button
    //     onClick={() => {
    //       getProfile();
    //     }}
    //   >
    //     getProfile
    //   </Button>
    //   <Text>{user?.displayName}</Text>
    //   <Text>{user?.pictureUrl}</Text>
    // </VStack>
    null
  );
};
