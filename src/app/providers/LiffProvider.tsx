"use client";

import type liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";
import { useLoading } from "@yamada-ui/react";
import { useSetAtom } from "jotai";
import { createContext, useContext, useEffect, useState } from "react";

import {
  useCreateUserMutation,
  useGetUserByUserIdLazyQuery,
} from "@/generated/graphql";
import { superBaseIdState } from "@/lib/jotai_state";
import { exampleUser2 } from "@/lib/mockData";

interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

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
  const { screen } = useLoading();
  const [createUser] = useCreateUserMutation();
  const [getUser] = useGetUserByUserIdLazyQuery();
  const setSuperBaseIdState = useSetAtom(superBaseIdState);

  useEffect(() => {
    async function initLiff() {
      screen.start();
      if (process.env.NODE_ENV === "development") {
        const liffModule = await import("@line/liff");
        liffModule.default.use(new LiffMockPlugin());
        await liffModule.default.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          // @ts-expect-error: mock property is provided by LiffMockPlugin
          mock: true,
          withLoginOnExternalBrowser: true,
        });
        setLiffObject(liffModule.default);
        liffModule.liff.login();
        setUser(exampleUser2);
        screen.finish();
        return;
      }
      try {
        const liffModule = await import("@line/liff");
        console.log("start liff.init()...");
        await liffModule.default.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          withLoginOnExternalBrowser: true,
        });
        console.log("liff.init() done");
        setLiffObject(liffModule.default);

        // ユーザーがログインしている場合にプロフィール情報を取得
        if (liffModule.default.isLoggedIn()) {
          const profile = await liffModule.default.getProfile();
          setUser({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl ?? "",
          });
          const { data } = await getUser();

          console.log(data);
          if (data?.userByUserId === null) {
            const result = await createUser({
              variables: {
                input: {
                  userId: profile.userId,
                  displayName: profile.displayName,
                  pictureUrl: profile.pictureUrl ?? "",
                },
              },
            });
            const id = result.data?.createUser?.id ?? null;
            setSuperBaseIdState(id);
          } else {
            const id = data?.userByUserId?.id ?? null;
            setSuperBaseIdState(id);
          }
        }
      } catch (error) {
        console.error(`liff.init() failed: ${error}`);
        setLiffError(error instanceof Error ? error.message : String(error));
      } finally {
        screen.finish();
      }
    }

    if (typeof window !== "undefined") {
      initLiff();
    }
  }, []);

  return (
    <LiffContext.Provider value={{ liff: liffObject, user, error: liffError }}>
      {children}
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
