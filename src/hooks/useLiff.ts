"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

import { liffState, userState } from "@/lib/jotai_state";
import { UserProfileSchema } from "@/lib/type";

import { useGlobalContext } from "./useGlobalContext";

export const useLiff = () => {
  const [currentLiff, setCurrentLiff] = useAtom(liffState);
  const [user, setUser] = useAtom(userState);
  const { liff, liffError } = useGlobalContext();

  const getProfile = useCallback(async () => {
    if (!currentLiff) return;
    try {
      const result = await currentLiff.getProfile();
      const validatedData = UserProfileSchema.parse(result);
      setUser(validatedData);
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }, [currentLiff, setUser, user]);

  useEffect(() => {
    getProfile();
  }, [currentLiff, getProfile, setUser, user]);

  const loginLiff = () => {
    try {
      if (!liff) return;
      if (liff.isLoggedIn()) return;
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
