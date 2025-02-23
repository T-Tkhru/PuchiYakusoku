"use client";

import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { liffState, userState } from "@/lib/jotai_state";
import { exampleUser2 } from "@/lib/mockData";
import { UserProfileSchema } from "@/lib/type";

export const useLiff = () => {
  const [currentLiff, setCurrentLiff] = useAtom(liffState);
  const [user, setUser] = useAtom(userState);

  const setupLiff = useCallback(async () => {
    if (process.env.NODE_ENV === "development") {
      liff.use(new LiffMockPlugin());
      await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        // @ts-expect-error: mock property is provided by LiffMockPlugin
        mock: true,
      });
      setCurrentLiff(liff);
      return;
    }
    await liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        // withLoginOnExternalBrowser: true,
      })
      .catch((error: Error) => {
        console.log("LIFF init failed.");
        console.error(error.toString());
      });
    setCurrentLiff(liff);
    console.log(liff);
  }, [setCurrentLiff]);

  const getProfile = useCallback(async () => {
    if (process.env.NODE_ENV === "development") {
      return setUser(exampleUser2);
    }
    if (!liff) return;

    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        const result = await liff.getProfile();
        const validatedData = UserProfileSchema.parse(result);
        setUser(validatedData);
        console.log(user);
      })
      .then(() => {
        console.log("success");
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  }, [setUser, user]);

  useEffect(() => {
    if (!currentLiff) {
      setupLiff();
      return;
    }
    getProfile();
  }, [currentLiff]);

  const loginLiff = () => {
    try {
      console.log(currentLiff);
      if (!currentLiff) return;
      if (currentLiff.isLoggedIn()) return;
      currentLiff.login();
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  const sendShareText = (message: string) => {
    if (!currentLiff) return;
    currentLiff
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
  };

  return {
    currentLiff,
    loginLiff,
    getProfile,
    user,
    sendShareText,
  };
};
