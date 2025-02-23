"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";

import { liffState, userState } from "@/lib/jotai_state";
import { UserProfileSchema } from "@/lib/type";

import { useGlobalContext } from "./useGlobalContext";

export const useLiff = () => {
  const [currentLiff, setCurrentLiff] = useAtom(liffState);
  const [user, setUser] = useAtom(userState);
  const { liff, liffError } = useGlobalContext();

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!currentLiff) return;
        const result = await currentLiff.getProfile();
        const validatedData = UserProfileSchema.parse(result);
        setUser(validatedData);
        console.log(user);
      } catch (error) {
        alert(error);
        console.error(error);
      }
    };

    getProfile();
  }, [currentLiff, setUser, user]);

  const loginLiff = () => {
    try {
      if (!liff) return;
      liff.login();
      liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(() => {
        setCurrentLiff(liff);
      });
    } catch (error) {
      alert(error);
      console.error(error, liffError);
    }
  };
  return { currentLiff, loginLiff, user };
};
