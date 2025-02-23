"use client";

import liff from "@line/liff";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { liffState, userState } from "@/lib/jotai_state";
import { UserProfileSchema } from "@/lib/type";

export const useLiff = () => {
  const [currentLiff, setCurrentLiff] = useAtom(liffState);
  const [user, setUser] = useAtom(userState);
  // const { liff, liffError } = useGlobalContext();

  const setupLiff = useCallback(async () => {
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
  }, [setCurrentLiff]);

  const getProfile = useCallback(async () => {
    if (!liff) return;

    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        const result = await liff.getProfile();
        const validatedData = UserProfileSchema.parse(result);
        alert(validatedData);
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
  }, [currentLiff, getProfile, setupLiff]);

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
  };
};
