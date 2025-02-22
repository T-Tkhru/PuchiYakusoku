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
        const profile = await liff.getProfile();
        setName(profile.displayName);
      } catch (error) {
        alert(error);
        console.error(error);
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
      <button
        onClick={() => {
          if (!liff) return;
          liff
            .shareTargetPicker(
              [
                {
                  type: "text",
                  text: "Hello, World!",
                },
              ],
              {
                isMultiple: true,
              }
            )
            .then(function (res) {
              if (res) {
                // succeeded in sending a message through TargetPicker
                console.log(`[${res.status}] Message sent!`);
              } else {
                // sending message canceled
                console.log("TargetPicker was closed!");
              }
            })
            .catch(function (error) {
              alert(error);
              console.log("something wrong happen");
            });
        }}
      >
        shareTargetPicker
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
