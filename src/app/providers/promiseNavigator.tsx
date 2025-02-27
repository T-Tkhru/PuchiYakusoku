"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export const PromiseNavigator = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const router = useRouter();

  useEffect(() => {
    if (query) {
      router.replace(`/promise/${query}`);
    }
  }, [query, router]);
  return <React.Fragment>{children}</React.Fragment>;
};
