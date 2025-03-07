"use client";
import "dayjs/locale/ja";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Calendar } from "@yamada-ui/calendar";
import { ActivityIcon, RefreshCwIcon } from "@yamada-ui/lucide";
import {
  Button,
  Center,
  Container,
  Dialog,
  DialogBody,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Image,
  SegmentedControl,
  SegmentedControlButton,
  SegmentedControlItem,
  Select,
  SelectItem,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import {
  Level,
  useCreatePromiseMutation,
  useDeletePromiseMutation,
} from "@/generated/graphql";
import { usePromiseList } from "@/hooks/usePromiseList";
import { createMessageString, getDueDate } from "@/lib/control-form";
import { gestUser } from "@/lib/mockData";
import { PromiseSchema } from "@/lib/type";

import { UserCard } from "../../_components/Card";
import { HomeButton } from "../../_components/GoBackButton";
import { ResultDialog } from "../../_components/ResultDialog";
import { useLiff } from "../../providers/LiffProvider";

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
  const router = useRouter();
  const { user, liff } = useLiff();
  const { onOpen, onClose } = useDisclosure();
  const [importance, setImportance] = useState<Level>(Level.Low);
  const textContentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selectDueDateType, setSelectDueDateType] = useState<string>("none");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [isReverse, setIsReverse] = useState(true);
  const [isShare, setIsShare] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    isInvalidError?: boolean;
    animeComponent?: React.ReactNode;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const handleReverse = () => {
    setIsReverse(!isReverse);
  };

  const [createPromise, { loading }] = useCreatePromiseMutation({
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラーが発生しました",
        message: "もう一度お試しください",
      });
    },
  });
  const [deletePromise] = useDeletePromiseMutation();
  const { addPromise } = usePromiseList();

  return (
    <React.Fragment>
      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={() => {
          setResultDialog({ ...resultDialog, isOpen: false });
          if (!resultDialog.isInvalidError) {
            router.push("/home");
          }
        }}
        animeComponent={resultDialog.animeComponent}
      />
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
        <HomeButton />
        <Heading py={2}>約束をプチる</Heading>
        <VStack w="full" alignItems="center">
          <Container
            bgColor="primary"
            color="white"
            rounded="md"
            alignItems="center"
            fontWeight={600}
            py={1}
            maxH={12}
            justifyContent="center"
          >
            <Text fontWeight={800}>約束の内容は？</Text>
          </Container>

          <VStack alignItems="center" gap={0}>
            <HStack gap={6}>
              <UserCard user={isReverse ? user : gestUser} color="secondary" />
              <Text fontSize="6xl">{isShare ? "と" : "が"}</Text>
              <UserCard
                user={isReverse ? gestUser : user}
                color={isShare ? "secondary" : "primary"}
              />

              <Text fontSize="6xl">{isShare ? "は" : "に"}</Text>
            </HStack>
            <Center pr={16}>
              <IconButton
                zIndex={10}
                icon={isShare ? <ActivityIcon /> : <RefreshCwIcon />}
                aria-label="left-right"
                fontSize="24"
                colorScheme={isShare ? "secondary" : "primary"}
                h="12"
                w="12"
                rounded="full"
                onClick={handleReverse}
                disabled={isShare}
                boxShadow="0px 4px teal"
                _active={{
                  transform: isShare
                    ? "none"
                    : "translateY(2px) scale(0.9) rotate(180deg)",
                  backgroundColor: "teal.800",
                  boxShadow: "none",
                }}
              />
            </Center>
          </VStack>
          <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Text>誰が？</Text>
            <SegmentedControl
              colorScheme={isShare ? "secondary" : "primary"}
              border="2px solid"
              borderColor="border"
              defaultValue="low"
              rounded="md"
              size="sm"
              h="9"
              value={isShare ? "IsShare" : "IsDirect"}
              onChange={(value) => setIsShare(value === "IsShare")}
            >
              <SegmentedControlButton value="IsDirect">
                片方が約束
              </SegmentedControlButton>
              <SegmentedControlButton value="IsShare">
                お互いが約束
              </SegmentedControlButton>
            </SegmentedControl>
          </HStack>
          <FormControl label="何をする？" p={2}>
            <Textarea
              variant="filled"
              placeholder="回らない寿司を奢る"
              h="32"
              focusBorderColor="teal.500"
              ref={textContentRef}
              border={"2px solid"}
              borderColor="border"
            />
          </FormControl>
          <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Text>重要度</Text>
            <SegmentedControl
              colorScheme="primary"
              border="2px solid"
              borderColor="border"
              defaultValue="low"
              rounded="md"
              size="sm"
              h="9"
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
                placeholder="いつまでかを選択"
                focusBorderColor="teal.500"
                onChange={(value) => {
                  setSelectDueDateType(value);
                }}
                items={dueDateItems}
                boxShadow={"0px 4px #9C9C9CFF"}
                _active={{
                  backgroundColor: "gray.50",
                  boxShadow: "none",
                }}
              ></Select>
              {selectDueDateType === "other" && (
                <Calendar
                  locale="ja"
                  border="2px solid"
                  borderColor="border"
                  rounded="md"
                  p={2}
                  size="sm"
                  value={dueDate}
                  onChange={(date: React.SetStateAction<Date>) => {
                    setDueDate(date);
                  }}
                  boxShadow={"0px 4px #9C9C9CFF"}
                />
              )}
            </VStack>
          </HStack>
        </VStack>
        {user ? (
          <Button
            py={4}
            colorScheme="secondary"
            rounded="full"
            size="lg"
            fontWeight={800}
            boxShadow="0px 6px #EB777B"
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "pink.800",
              boxShadow: "none",
            }}
            onClick={async () => {
              if (!liff) return;
              if (!textContentRef.current?.value) {
                setResultDialog({
                  isOpen: true,
                  type: "error",
                  title: "内容がないよう、、、",
                  message: "約束の内容を入力してください",
                  isInvalidError: true,
                });
                return;
              }
              onOpen();
              const result = await createPromise({
                variables: {
                  input: {
                    direction: isReverse,
                    content: textContentRef.current?.value ?? "",
                    level: importance,
                    dueDate:
                      getDueDate(selectDueDateType) === undefined
                        ? dueDate.toISOString()
                        : getDueDate(selectDueDateType),
                    isShare: isShare,
                  },
                },
              });
              console.log(result);
              const promiseId = result.data?.createPromise?.id;
              onClose();
              liff
                .shareTargetPicker(
                  [
                    {
                      type: "template",
                      altText: `${user.displayName}からプチ約束が届きました！`,
                      template: {
                        type: "buttons",
                        thumbnailImageUrl:
                          "https://i.gyazo.com/7cd231d1ef9d9ffed9d2884d321718fd.png",
                        imageAspectRatio: "rectangle",
                        imageSize: "cover",
                        imageBackgroundColor: "#6ac1b7",
                        text: createMessageString(user, importance),
                        actions: [
                          {
                            type: "uri",
                            label: "プチ約束を確認する",
                            uri:
                              `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}` +
                              `/?query=${promiseId}`,
                          },
                        ],
                      },
                    },
                  ],
                  {
                    isMultiple: true,
                  }
                )
                .then(async function (res) {
                  if (res) {
                    console.log(`[${res.status}] Message sent!`);
                    // 成功時のみ `setResultDialog()` を実行
                    setResultDialog({
                      isOpen: true,
                      type: "success",
                      title: "友達に送信しました！",
                      message: "相手が約束に気づきますように！",
                      animeComponent: (
                        <DotLottieReact
                          src="https://lottie.host/7a47b0a7-46d5-4ed7-be85-021d2183fb03/0snzZ7MWjb.lottie"
                          loop
                          autoplay
                        />
                      ),
                    });
                  } else {
                    // 失敗時は `deletePromise()` を実行し、`setResultDialog()` は呼ばない
                    if (promiseId) {
                      await deletePromise({
                        variables: {
                          id: promiseId,
                        },
                      });
                    } else {
                      const updatedPromise = PromiseSchema.parse(
                        result.data?.createPromise
                      );
                      addPromise(updatedPromise);
                    }
                    console.log("TargetPicker was closed!");
                  }
                })
                .catch(function (error) {
                  alert(error);
                });
            }}
          >
            約束する
          </Button>
        ) : null}
      </VStack>
    </React.Fragment>
  );
}
