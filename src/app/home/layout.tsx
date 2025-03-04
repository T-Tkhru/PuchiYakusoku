"use client";

import { Avatar, Heading, HStack, VStack } from "@yamada-ui/react";
import React from "react";

import { useLiff } from "@/app/providers/LiffProvider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useLiff();
  return (
    <React.Fragment>
      <VStack px={8} py={4} minH="100vh" gap={8} alignItems="center">
        <HStack justifyContent="space-between" w="full">
          <Heading py={4}>ホーム</Heading>
          <Avatar src={user?.pictureUrl} />
        </HStack>
        {children}
      </VStack>
    </React.Fragment>
  );
}
