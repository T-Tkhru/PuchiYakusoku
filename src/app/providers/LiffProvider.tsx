"use client";

import type liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

import { exampleUser2 } from "@/lib/mockData";
import { UserProfile } from "@/lib/type";

import { slides, StoryLoading } from "../_components/Welcome";

interface LiffContextType {
  liff: typeof liff | null;
  user: UserProfile | null;
  error: string | null;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initLiff() {
      setLoading(true);
      // if (process.env.NODE_ENV === "development") {
      //   const liffModule = await import("@line/liff");
      //   liffModule.default.use(new LiffMockPlugin());
      //   await liffModule.default.init({
      //     liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
      //     // @ts-expect-error: mock property is provided by LiffMockPlugin
      //     mock: true,
      //     withLoginOnExternalBrowser: true,
      //   });
      //   setLiffObject(liffModule.default);
      //   liffModule.liff.login();
      //   setUser(exampleUser2);
      //   setLoading(false);
      //   return;
      // }
      try {
        const liffModule = await import("@line/liff");
        console.log("start liff.init()...");
        await liffModule.default.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          withLoginOnExternalBrowser: true,
        });
        console.log("liff.init() done");
        setLiffObject(liffModule.default);
        // トークンをローカルストレージに保存
        const accessToken = liffModule.default.getAccessToken();
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (user) {
          console.log("User already set, skipping login.");
          return;
        }
        if (liffModule.default.isLoggedIn()) {
          const profile = await liffModule.default.getProfile();
          const response = await axios.post(
            "/api/login",
            {},
            {
              headers: {
                Authorization: accessToken ? `Bearer ${accessToken}` : "",
              },
            }
          );
          console.log(response);

          if (response.status === 200) {
            setUser({
              id: response.data.id,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl ?? "",
            });
            console.log("login success");
          }
        }
      } catch (error) {
        console.error(`liff.init() failed: ${error}`);
        setLiffError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    }

    if (typeof window !== "undefined") {
      initLiff();
    }
  }, [user]);

  return (
    <LiffContext.Provider value={{ liff: liffObject, user, error: liffError }}>
      {loading ? <StoryLoading slides={slides} interval={3000} /> : children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
};
