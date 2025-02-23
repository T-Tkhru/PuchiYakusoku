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
  VStack,
} from "@yamada-ui/react";
import { signIn } from "next-auth/react";

import { useUserData } from "@/hooks/useUserData";
import { exampleUser } from "@/lib/mockData";

import { UserCard } from "./../_components/Card";
import { Header } from "./../_components/Header";
import { Liff } from "./../_components/Liff";

export default function Home() {
  const { user } = useUserData();
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
          <Container
            p={2}
            bgColor="primary"
            color="white"
            rounded="md"
            alignItems="center"
          >
            誰と約束する？
          </Container>
          <IconButton
            icon={<BoneIcon />}
            aria-label="Search database"
            colorScheme="primary"
          />
          <VStack w="full">
            {user ? (
              <HStack>
                <UserCard user={user} />
                <UserCard user={exampleUser} />
              </HStack>
            ) : (
              <Heading size="md" p={4}>
                ようこそ、ゲストさん
              </Heading>
            )}
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
            <Input variant="outline" placeholder="outline" />
            <SegmentedControl backgroundColor="teal.200">
              <SegmentedControlButton value="重要度">
                重要度
              </SegmentedControlButton>
              <SegmentedControlButton value="軽い約束">
                軽い約束
              </SegmentedControlButton>
              <SegmentedControlButton value="少し重要">
                少し重要
              </SegmentedControlButton>
            </SegmentedControl>
            <NativeSelect placeholder="期限を選択">
              <NativeOption value="期限なし">期限なし</NativeOption>
              <NativeOption value="1日">1日</NativeOption>
              <NativeOption value="1週間">1週間</NativeOption>
              <NativeOption value="1か月">1か月</NativeOption>
              <NativeOption value="その他">その他</NativeOption>
            </NativeSelect>
            <Liff />
            <Button
              colorScheme="secondary"
              onClick={async () => {
                await signIn("line", { redirectTo: "/" });
              }}
            >
              ログイン
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}
