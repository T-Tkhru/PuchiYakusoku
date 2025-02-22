"use client";

import { fetchUserSimple } from "@/lib/request";
import { useEffect, useState } from "react";
import { userSimpleState } from "@/lib/jotai_state";
import { useAtom } from "jotai";

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
  }, []);

  return { user };
};
