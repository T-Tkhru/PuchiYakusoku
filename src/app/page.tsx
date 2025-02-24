"use client";

import { Calendar } from "@yamada-ui/calendar";
import { ArrowRightLeft } from "@yamada-ui/lucide";
import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  IconButton,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectItem,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import React, { useRef, useState } from "react";

import { Level, useCreatePromiseMutation } from "@/generated/graphql";
import { createMessageString, getDueDate } from "@/lib/control-form";
import { exampleUser } from "@/lib/mockData";

import { UserCard } from "./_components/Card";
import { Header } from "./_components/Header";
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
  const [importance, setImportance] = useState<Level>(Level.Low);
  const textContentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectDueDateType, setSelectDueDateType] = useState<string>("none");
  const [createPromise] = useCreatePromiseMutation();
  const [dueDate, setDueDate] = useState<Date>(new Date());

  const [leftright, setLeftRight] = useState(false);

  const handleLeftRight = () => {
    setLeftRight(!leftright);
  };
  if (!user) {
    return null;
  }
  return (
    <React.Fragment>
      <Header />
      <VStack w="full" p={4} gap={4}>
        <VStack w="full" alignItems="center">
          <Container
            bgColor="primary"
            color="white"
            rounded="md"
            alignItems="center"
            fontWeight={600}
          >
            約束の内容は？
          </Container>
          <HStack gap={4}>
            <UserCard user={user} />
            <Text fontSize="6xl">が</Text>
            <UserCard user={exampleUser} />
            <Text fontSize="6xl">に</Text>
          </HStack>
          <Center pr={16}>
            <IconButton
              icon={<ArrowRightLeft />}
              aria-label="left-right"
              colorScheme="primary"
              h="12"
              w="12"
              rounded="full"
              onClick={handleLeftRight}
            />
          </Center>
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
                  onChange={(date) => {
                    setDueDate(date);
                  }}
                />
              )}
            </VStack>
          </HStack>
        </VStack>
        <Button
          colorScheme="secondary"
          onClick={() => {
            if (!liff) return;
            liff
              .shareTargetPicker(
                [
                  {
                    type: "text",
                    text: createMessageString(user, importance),
                  },
                ],
                {
                  isMultiple: true,
                }
              )
              .then(function (res) {
                // if (res) {

                //   console.log(`[${res.status}] Message sent!`);
                // } else {
                //   console.log("TargetPicker was closed!");
                // }
                createPromise({
                  variables: {
                    input: {
                      content: textContentRef.current?.value ?? "",
                      level: importance,
                      dueDate:
                        getDueDate(selectDueDateType) ?? dueDate.toISOString(),
                      senderId: user.userId,
                    },
                  },
                });
              })
              .catch(function (error) {
                alert(error);
              });
          }}
        >
          約束する
        </Button>
      </VStack>
    </React.Fragment>
  );
}
