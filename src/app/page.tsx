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
  Select,
  Option,
  Textarea,
  VStack,
  SelectItem,
  SegmentedControlItem,
} from "@yamada-ui/react";
import { signIn } from "next-auth/react";

import { useUserData } from "@/hooks/useUserData";
import { Header } from "./_components/Header";
import { Liff } from "./_components/Liff";

const importanceItems: SegmentedControlItem[] = [
  { label: "軽い約束", value: "low" },
  { label: "少し重要", value: "medium" },
  { label: "お金が絡む", value: "high" },
];

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
            <Textarea
              variant="filled"
              placeholder="約束の内容を書き込んでね"
              colorScheme="teal"
              borderColor="teal.500"
              focusBorderColor="teal.600"
            />
            <SegmentedControl
              backgroundColor="teal.200"
              items={importanceItems}
            />
            <Select
              placeholder="期限を選択"
              colorScheme="teal"
              focusBorderColor="teal.600"
            >
              <Option value="期限なし">期限なし</Option>
              <Option value="1日">1日</Option>
              <Option value="1週間">1週間</Option>
              <Option value="1か月">1か月</Option>
              <Option value="その他">その他</Option>
            </Select>
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
