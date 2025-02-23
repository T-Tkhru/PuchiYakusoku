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
import PromiseContents from "../_components/PromiseContents";
import { useState } from "react";

export default function Home() {
  const { user } = useUserData(); //このページにアクセスした人を表す
  const [promise, setPromise] = useState(false);
  const [finish, setFinish] = useState(false);
  const username = "山田太郎";
  const sender = ["山田太郎", "yamada"]; //仮置き、データベースから引っ張ってくる
  const receiver = ["大塚遙", "ohtsuka"]; //仮置き、データベースから引っ張ってくる

  const handlePromise = () => {
    setPromise(!promise);
  };

  const handleFinish = () => {
    setFinish(!finish);
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
      {finish ? (
        <Box w="100%" maxW="480px" backgroundColor="white" p={4}>
          <Header />
          <VStack w="full" p={4} gap={4}>
            <Container
              p={2}
              bgColor="primary"
              color="white"
              rounded="md"
              alignItems="center"
              fontWeight={600}
            >
              約束は完了しました！
            </Container>
            <PromiseContents
              sender="山田太郎"
              receiver="大塚遙"
              content="ポスター発表で寿司をおごる"
              deadline="2025/3/31"
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
            </VStack>
            <Button colorScheme="primary" onClick={handleFinish}>
              約束完了前に戻る（デバッグ用）
            </Button>
          </VStack>
        </Box>
      ) : (
        <Box w="100%" maxW="480px" backgroundColor="white" p={4}>
          <Header />
          <VStack w="full" p={4} gap={4}>
            <Container
              p={2}
              bgColor="primary"
              color="white"
              rounded="md"
              alignItems="center"
              fontWeight={600}
            >
              約束内容
            </Container>
            <PromiseContents
              sender="山田太郎"
              receiver="大塚遙"
              content="ポスター発表で寿司をおごる"
              deadline="2025/3/31"
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
              {promise ? (
                <VStack>
                  <Button colorScheme="primary">
                    リマインドする（催促する）
                  </Button>
                  <Button colorScheme="primary" onClick={handleFinish}>
                    約束を完了した
                  </Button>
                  <Button colorScheme="primary" onClick={handlePromise}>
                    約束をキャンセルする（デバッグ用）
                  </Button>
                </VStack>
              ) : username === "山田太郎" ? (
                <Container centerContent>承認待ちです</Container>
              ) : (
                <Button colorScheme="primary" onClick={() => setPromise(true)}>
                  約束をする
                </Button>
              )}
            </VStack>
          </VStack>
        </Box>
      )}
    </Container>
  );
}
