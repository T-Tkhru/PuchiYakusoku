"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";

import { userSimpleState } from "@/lib/jotai_state";
import { fetchUserSimple } from "@/lib/request";

export const useUserData = () => {
  const [user, setUser] = useAtom(userSimpleState);
  console.log(user);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const result = await fetchUserSimple();
        if (result instanceof Error) {
          throw Error("Failed to fetch user profile");
        }
        setUser(result);
      } catch (error) {
        console.error(error);
      }
    };

    getProfile();
  }, [setUser]);

  return { user };
};
