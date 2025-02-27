"use client";

import { Calendar } from "@yamada-ui/calendar";
import { ArrowLeftIcon, RefreshCwIcon } from "@yamada-ui/lucide";
import {
  Button,
  Center,
  Container,
  Dialog,
  DialogBody,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectItem,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import Link from "next/link";
import React, { useRef, useState } from "react";

import { Level, useCreatePromiseMutation } from "@/generated/graphql";
import { createMessageString, getDueDate } from "@/lib/control-form";
import { gestUser } from "@/lib/mockData";

import { UserCard } from "./_components/Card";
import { BackButton } from "./_components/GoBackButton";
import { useLiff } from "./providers/LiffProvider";

const importanceItems: SegmentedControlItem[] = [
  { label: "軽い約束", value: Level.Low },
  { label: "少し重要", value: Level.Medium },
  { label: "お金が絡む", value: Level.High },
];

const dueDateItems: SelectItem[] = [
  { label: "期限なし", value: "none" },
  { label: "1日", value: "1day" },
  { label: "1週間", value: "1week" },
  { label: "1か月", value: "1month" },
  { label: "その他", value: "other" },
];

export default function Home() {
  const { user, liff } = useLiff();
  const { onOpen, onClose } = useDisclosure();
  const [importance, setImportance] = useState<Level>(Level.Low);
  const textContentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectDueDateType, setSelectDueDateType] = useState<string>("none");
  const [createPromise, { loading }] = useCreatePromiseMutation();
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const [isReverse, setIsReverse] = useState(false);

  const handleReverse = () => {
    setIsReverse(!isReverse);
  };
  if (!user) {
    return <Text>loading...</Text>;
  }
  return (
    <React.Fragment>
      <Dialog
        open={loading}
        onClose={onClose}
        header="約束を用意中..."
        size="md"
      >
        <DialogBody alignItems="center">
          <Image
            src="/loading_icon.png"
            alt="loading"
            width={140}
            height={140}
          />
        </DialogBody>
      </Dialog>
      <VStack w="full" px={8} py={4} gap={4}>
        <BackButton />
        <Heading py={4}>約束をプチる</Heading>
        <VStack w="full" alignItems="center">
          <Container
            bgColor="primary"
            color="white"
            rounded="md"
            alignItems="center"
            fontWeight={600}
            py={2}
            maxH={12}
            justifyContent="center"
          >
            <Text fontWeight={800}>約束の内容は？</Text>
          </Container>
          <VStack alignItems="center" gap={0}>
            <HStack gap={4}>
              <UserCard user={isReverse ? gestUser : user} color="primary" />
              <Text fontSize="6xl">が</Text>
              <UserCard user={isReverse ? user : gestUser} color="primary" />
              <Text fontSize="6xl">に</Text>
            </HStack>
            <Center pr={16}>
              <IconButton
                zIndex={10}
                icon={<RefreshCwIcon />}
                aria-label="left-right"
                fontSize="24"
                colorScheme="primary"
                h="12"
                w="12"
                rounded="full"
                onClick={handleReverse}
              />
            </Center>
          </VStack>
          <Textarea
            variant="filled"
            placeholder="回らない寿司を奢る"
            h="32"
            focusBorderColor="teal.500"
            ref={textContentRef}
          />
          <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Text>重要度</Text>
            <SegmentedControl
              colorScheme="primary"
              backgroundColor="gray.50"
              defaultValue="low"
              size="sm"
              items={importanceItems}
              value={importance}
              onChange={(value) => setImportance(value as Level)}
            ></SegmentedControl>
          </HStack>

          <HStack
            justifyContent="space-between"
            alignItems="center"
            p={2}
            w="full"
          >
            <Text w="full">期限</Text>
            <VStack p={"null"} m={"null"}>
              <Select
                w="60"
                placeholder="期限を選択"
                focusBorderColor="teal.500"
                onChange={(value) => {
                  setSelectDueDateType(value);
                }}
                items={dueDateItems}
              ></Select>
              {selectDueDateType === "other" && (
                <Calendar
                  value={dueDate}
                  onChange={(date: React.SetStateAction<Date>) => {
                    setDueDate(date);
                  }}
                />
              )}
            </VStack>
          </HStack>
        </VStack>
        <Button
          py={4}
          colorScheme="secondary"
          rounded="full"
          size="lg"
          fontWeight={800}
          boxShadow="0px 6px pink"
          // border="2px solid"
          transition="all 0.2s ease"
          _hover={{
            boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.3)",
            transform: "translateY(-4px)",
            backgroundColor: "secondary.600",
          }}
          _active={{
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
            transform: "translateY(0)",
          }}
          onClick={async () => {
            if (!liff) return;
            onOpen();
            const result = await createPromise({
              variables: {
                input: {
                  direction: isReverse,
                  content: textContentRef.current?.value ?? "",
                  level: importance,
                  dueDate:
                    getDueDate(selectDueDateType) ?? dueDate.toISOString(),
                },
              },
            });
            console.log(result);
            const promiseId = result.data?.createPromise?.id;
            liff
              .shareTargetPicker(
                [
                  {
                    type: "text",
                    text: createMessageString(user, importance),
                  },
                  {
                    type: "text",
                    text:
                      `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}` +
                      `/?query=${promiseId}`,
                  },
                ],
                {
                  isMultiple: true,
                }
              )
              .then(function (res) {
                if (res) {
                  console.log(`[${res.status}] Message sent!`);
                } else {
                  console.log("TargetPicker was closed!");
                }
              })
              .catch(function (error) {
                alert(error);
              });
            onClose();
          }}
        >
          約束する
        </Button>
      </VStack>
    </React.Fragment>
  );
}

