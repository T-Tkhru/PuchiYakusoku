"use client";

import { Level } from "@prisma/client";
import {
  Avatar,
  Button,
  Divider,
  HStack,
  Loading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React, { useState } from "react";

import { HomeButton } from "@/app/_components/GoBackButton";
import { PromiseContents } from "@/app/_components/PromiseContents";
import { ResultDialog } from "@/app/_components/ResultDialog";
import { useLiff } from "@/app/providers/LiffProvider";
import {
  useAcceptPromiseMutation,
  useRejectPromiseMutation,
} from "@/generated/graphql";
import { promiseState } from "@/lib/jotai_state";
import { sendMessage } from "@/lib/request";
import {
  defineStatus,
  headerMessage,
  imageSource,
  StatusEnum,
} from "@/lib/status";
import { Promise } from "@/lib/type";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
}

function ActionModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
}: ActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>{message}</Text>
      </ModalBody>
      <ModalFooter>
        <VStack w="full" gap={2}>
          <Button
            colorScheme="primary"
            size="sm"
            onClick={onConfirm}
            boxShadow="0px 4px teal"
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "teal.800",
              boxshadow: "none",
            }}
          >
            もちろん！
          </Button>
          <Button
            colorScheme="gray"
            size="sm"
            onClick={onClose}
            boxShadow={"0px 4px #9C9C9CFF"}
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "gray.50",
              boxshadow: "none",
            }}
          >
            キャンセル
          </Button>
        </VStack>
      </ModalFooter>
    </Modal>
  );
}

export default function PromiseDetail() {
  const { user } = useLiff();
  const promise = useAtomValue(promiseState);
  if (promise === null) {
    return (
      <VStack
        bgColor="primary"
        px={12}
        py={12}
        minH="100vh"
        gap={8}
        alignItems="center"
      >
        <Text color="white" fontSize="2xl" fontWeight={800}>
          約束データを取得中...
        </Text>
        <Loading color="white" fontSize="4xl" speed="0.65s" />
      </VStack>
    );
  }
  const status = defineStatus(promise, user!);

  return (
    <VStack
      bgColor={`${status.baseColor}.500`}
      p={8}
      minH="100vh"
      gap={8}
      alignItems="center"
    >
      <HomeButton color="white" />
      <Image
        src={imageSource(status)}
        alt="mail icon"
        width={200}
        height={200}
        objectFit="contain"
      />
      <HStack color="white" gap={4}>
        <Avatar
          src={promise.sender?.pictureUrl as string}
          size="lg"
          border="4px solid"
          borderColor="white"
        />
        <VStack alignItems="flex-start" gap={2}>
          <Text fontWeight={600} fontSize="2xl">
            {headerMessage(promise.sender.displayName, status).map(
              (line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              )
            )}
          </Text>
        </VStack>
      </HStack>
      <VStack alignItems="center">
        <Divider orientation="horizontal" />
      </VStack>
      <PromiseContents
        sender={promise.sender}
        receiver={promise.receiver}
        content={promise.content as string}
        deadline={promise.dueDate}
        level={promise.level as Level}
        color={`${status.baseColor}.500`}
      />
      <VStack w="full">
        {status.status === StatusEnum.UN_READ && (
          <UnReadStatusButtons promise={promise} />
        )}
        {status.status === StatusEnum.IS_ACCEPTED && (
          <IsAcceptedStatusButtons promise={promise} />
        )}
        {status.status === StatusEnum.MY_PROMISE && (
          <MyPromiseButtons promise={promise} />
        )}
        {status.status === StatusEnum.IS_COMPLETED && (
          <IsCompletedStatusButtons promise={promise} />
        )}
      </VStack>
    </VStack>
  );
}

interface ActionButtonProps {
  promise: Promise;
}

const UnReadStatusButtons = ({ promise }: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState<"accept" | "cancel" | null>(null);
  const [acceptPromise] = useAcceptPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "成功",
        message: "約束が正常にプチられました！",
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "約束処理中にエラーが発生しました。",
      });
    },
  });
  const [cancelPromise] = useAcceptPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "キャンセル成功",
        message: "約束が正常にキャンセルされました。",
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "キャンセル処理中にエラーが発生しました。",
      });
    },
  });

  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const handlePromise = async () => {
    await acceptPromise({ variables: { id: promise.id } });
    setIsOpen(null);
  };

  const handleCancel = async () => {
    await cancelPromise({ variables: { id: promise.id } });
    setIsOpen(null);
  };

  return (
    <VStack w="full">
      <ActionModal
        isOpen={isOpen === "accept"}
        onClose={() => setIsOpen(null)}
        title="約束をプチる"
        message="約束を結びます。よろしいですか？"
        onConfirm={handlePromise}
      />
      <ActionModal
        isOpen={isOpen === "cancel"}
        onClose={() => setIsOpen(null)}
        title="キャンセル"
        message="キャンセルします。よろしいですか？"
        onConfirm={handleCancel}
      />
      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={() => setResultDialog({ ...resultDialog, isOpen: false })}
      />
      <VStack>
        <Button
          colorScheme="primary"
          size="lg"
          fontWeight={800}
          rounded="full"
          onClick={() => setIsOpen("accept")}
          boxShadow="0px 4px teal"
          _active={{
            transform: "translateY(2px) scale(0.9) rotate(180deg)",
            backgroundColor: "teal.800",
            boxshadow: "none",
          }}
        >
          約束する
        </Button>
        <Button
          rounded="full"
          variant="outline"
          color="white"
          borderColor="white"
          colorScheme="blackAlpha"
          backgroundColor="blackAlpha.300"
          size="lg"
          fontWeight={800}
          onClick={() => setIsOpen("cancel")}
          boxShadow="0px 6px white"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "blackAlpha.800",
            boxshadow: "none",
          }}
        >
          キャンセルする
        </Button>
      </VStack>
    </VStack>
  );
};

const IsAcceptedStatusButtons = ({ promise }: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState<"cancel" | null>(null);

  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const [cancelPromise] = useRejectPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "キャンセル成功",
        message: "約束がキャンセルされました。",
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "キャンセル処理中にエラーが発生しました。",
      });
    },
  });

  const handleCancel = async () => {
    await cancelPromise({ variables: { id: promise.id } });
    setIsOpen(null);
  };

  return (
    <VStack w="full">
      <ActionModal
        isOpen={isOpen === "cancel"}
        onClose={() => setIsOpen(null)}
        title="キャンセル"
        message="キャンセルします。よろしいですか？"
        onConfirm={handleCancel}
      />
      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={() => setResultDialog({ ...resultDialog, isOpen: false })}
      />
      <VStack>
        <Button
          rounded="full"
          variant="outline"
          color="white"
          borderColor="white"
          colorScheme="blackAlpha"
          backgroundColor="blackAlpha.300"
          size="lg"
          fontWeight={800}
          onClick={() => setIsOpen("cancel")}
          boxShadow="0px 6px white"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "blackAlpha.800",
            boxshadow: "none",
          }}
        >
          キャンセルする
        </Button>
      </VStack>
    </VStack>
  );
};

const MyPromiseButtons = ({ promise }: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState<"cancel" | null>(null);
  const [cancelPromise] = useAcceptPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "キャンセル成功",
        message: "約束がキャンセルされました。",
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "キャンセル処理中にエラーが発生しました。",
      });
    },
  });
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const handleCancel = async () => {
    await cancelPromise({
      variables: {
        id: promise.id,
      },
    });
    setIsOpen(null);
  };

  return (
    <VStack w="full">
      <ActionModal
        isOpen={isOpen === "cancel"}
        onClose={() => setIsOpen(null)}
        title="キャンセル"
        message="キャンセルします。よろしいですか？"
        onConfirm={handleCancel}
      />
      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={() => setResultDialog({ ...resultDialog, isOpen: false })}
      />
      <VStack>
        <Button
          rounded="full"
          variant="outline"
          color="white"
          borderColor="white"
          colorScheme="blackAlpha"
          backgroundColor="blackAlpha.300"
          size="lg"
          fontWeight={800}
          onClick={() => setIsOpen("cancel")}
          boxShadow="0px 6px white"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "blackAlpha.800",
            boxshadow: "none",
          }}
        >
          キャンセルする
        </Button>
      </VStack>
    </VStack>
  );
};

const IsCompletedStatusButtons = ({ promise }: ActionButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const handleThank = async () => {
    try {
      await sendMessage(promise, "ありがとう！");
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "送信成功",
        message: "「ありがとう！」が正常に送信されました。",
      });
    } catch (error) {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "メッセージ送信中にエラーが発生しました。",
      });
      alert(error);
    }
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <ActionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="ありがとうを伝える"
        message="お礼を言います。よろしいですか？"
        onConfirm={handleThank}
      />
      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={() => setResultDialog({ ...resultDialog, isOpen: false })}
      />
      <Button
        rounded="full"
        variant="outline"
        color="white"
        borderColor="white"
        colorScheme="blackAlpha"
        backgroundColor="blackAlpha.300"
        size="lg"
        fontWeight={800}
        onClick={() => {}}
        boxShadow="0px 6px white"
        _active={{
          transform: "translateY(2px)",
          backgroundColor: "blackAlpha.800",
          boxshadow: "none",
        }}
      >
        お礼を言う
      </Button>
    </React.Fragment>
  );
};
