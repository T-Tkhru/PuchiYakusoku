"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { liffState, userState } from "@/lib/jotai_state";
import { UserProfileSchema } from "@/lib/type";
import { LiffMockPlugin } from "@line/liff-mock";
import liff from "@line/liff";

export const useLiff = () => {
  const [currentLiff, setCurrentLiff] = useAtom(liffState);
  const [user, setUser] = useAtom(userState);
  // const { liff, liffError } = useGlobalContext();

  const setupLiff = async (): Promise<void> => {
    await liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        withLoginOnExternalBrowser: true,
      })
      .then(async () => {
        // if (!liff.isLoggedIn()) {
        //   await liff.login();
        //   console.log("call login");
        // } else {
        //   console.log("already login");
        // }
      })
      .catch((error: Error) => {
        console.log("LIFF init failed.");
        console.error(error.toString());
      });
    setCurrentLiff(liff);
    console.log(liff);
  };

  const getProfile = useCallback(async () => {
    if (!liff) return;
    try {
      liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        const result = liff.getProfile();
        const validatedData = UserProfileSchema.parse(result);
        setUser(validatedData);
        console.log(user);
      }).then;
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!currentLiff) {
      setupLiff();
      return;
    }
    getProfile();
  }, []);

  const loginLiff = () => {
    try {
      console.log(currentLiff);
      if (!currentLiff) return;
      if (currentLiff.isLoggedIn()) return;
      currentLiff.login();
      // currentLiff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
      // setCurrentLiff(liff);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  const sendShareText = (message: string) => {
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
              text: message,
            },
          ],
          {
            isMultiple: true,
          }
        )
        .then(function (res) {
          if (res) {
            console.log(`[${res.status}] Message sent!`);
          } else {
            console.log("TargetPicker was closed!");
          }
        })
        .catch(function (error) {
          alert(error);
          console.log("something wrong happen");
        });
    });
  };

  return {
    currentLiff,
    loginLiff,
    getProfile,
    user,
    sendShareText,
    setCurrentLiff,
    setupMockLiff,
  };
};
