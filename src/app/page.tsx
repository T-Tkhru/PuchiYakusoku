"use client";

import { BoneIcon, Calendar, MailIcon } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Input,
  NativeOption,
  NativeSelect,
  SegmentedControl,
  SegmentedControlButton,
  Text,
  VStack,
} from "@yamada-ui/react";
import { signIn } from "next-auth/react";

import { useUserData } from "@/hooks/useUserData";
import { exampleUser } from "@/lib/mockData";

import { UserCard } from "./_components/Card";
import { Header } from "./_components/Header";
import { Liff } from "./_components/Liff";
import { useState } from "react";

export default function Home() {
  const { user } = useUserData();
  const [leftright, setLeftRight] = useState(false);

  const handleLeftRight = () => {
    setLeftRight(!leftright);
  };
  console.log(user);

  return (
    <Container
      w="full"
      minH="100vh"
      alignItems="center"
      p="0"
      backgroundColor="red.50"
    >
      <Box w="100%" maxW="480px" backgroundColor="white" p={4}>
        <Header />
        <VStack w="full" p={4} gap={4}>
          <VStack w="full">
            <Container
              p={2}
              bgColor="primary"
              color="white"
              rounded="md"
              alignItems="center"
              fontWeight={600}
            >
              約束の内容は？
            </Container>
            {user ? (
              leftright ? (
                <HStack>
                  <UserCard user={user} />
                  <Text fontSize="6xl">が</Text>
                  <UserCard user={exampleUser} />
                  <Text fontSize="6xl">に</Text>
                </HStack>
              ) : (
                <HStack>
                  <UserCard user={exampleUser} />
                  <Text fontSize="6xl">が</Text>
                  <UserCard user={user} />
                  <Text fontSize="6xl">に</Text>
                </HStack>
              )
            ) : (
              <Heading size="md" p={4}>
                ようこそ、ゲストさん
              </Heading>
            )}
            <IconButton
              icon={<BoneIcon />}
              aria-label="Search database"
              colorScheme="primary"
              onClick={handleLeftRight}
            />
            <Input variant="filled" placeholder="○○を△△する" h="32" />
            <HStack
              w="full"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Text>重要度</Text>
              <SegmentedControl
                colorScheme="primary"
                backgroundColor="white"
                defaultValue="軽い約束"
              >
                <SegmentedControlButton value="軽い約束">
                  軽い約束
                </SegmentedControlButton>
                <SegmentedControlButton value="少し重要">
                  少し重要
                </SegmentedControlButton>
                <SegmentedControlButton value="お金が絡む">
                  お金が絡む
                </SegmentedControlButton>
              </SegmentedControl>
            </HStack>

            <HStack
              w="full"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Text minW="60px">期限</Text>
              <NativeSelect placeholder="期限を選択">
                <NativeOption value="期限なし">期限なし</NativeOption>
                <NativeOption value="1日">1日</NativeOption>
                <NativeOption value="1週間">1週間</NativeOption>
                <NativeOption value="1か月">1か月</NativeOption>
                <NativeOption value="その他">その他</NativeOption>
              </NativeSelect>
            </HStack>

            <Liff />
            <Button
              colorScheme="secondary"
              onClick={async () => {
                await signIn("line", { redirectTo: "/" });
              }}
            >
              ログイン（本番では消す）
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}
