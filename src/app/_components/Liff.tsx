"use client";

import { useGlobalContext } from "@/hooks/useGlobalContext";
import { FC, useEffect, useState } from "react";

export const Liff: FC = () => {
  const { liff, liffError } = useGlobalContext();
  const [name, setName] = useState<string>("ユーザーデータなし");
  const [IDToken, setIDToken] = useState<string>("IDTokenなし");

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (!liff) return;
        const idToken = liff.getIDToken();
        setIDToken(idToken ?? "IDTokenなし");
        if (!idToken) {
          console.error("ID Token is null");
          return;
        }

        const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify({
            id_token: idToken,
            client_id: "2006950774",
          }),
        });

        if (!response.ok) {
          console.error("Failed to fetch profile:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Profile data:", data);
        setName(data.name ?? "Unknown");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [liff]);

  return (
    <div>
      <h2>create-liff-app</h2>
      {liff && <p>LIFF init succeeded.</p>}
      {liffError && (
        <>
          <p>LIFF init failed.</p>
          <p>
            <code>{liffError}</code>
          </p>
        </>
      )}
      <button
        onClick={() => {
          if (!liff) return;
          liff.login();
          liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(() => {
            liff.getIDToken();
            console.log("liff login");
          });
        }}
      >
        liffログイン
      </button>
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        target="_blank"
        rel="noreferrer"
      >
        LIFF Documentation
      </a>
      <p>{name}</p>
      <p>{IDToken}</p>
    </div>
  );
};
