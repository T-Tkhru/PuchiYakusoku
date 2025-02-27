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
  useDisclosure,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import React, { useState } from "react";

import { PromiseContents } from "@/app/_components/PromiseContents";
import { promiseState } from "@/lib/jotai_state";
import { defineStatus, headerMessage, imageSource } from "@/lib/status";

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
          <Button colorScheme="primary" size="sm" onClick={onConfirm}>
            もちろん！
          </Button>
          <Button colorScheme="gray" size="sm" onClick={onClose}>
            キャンセル
          </Button>
        </VStack>
      </ModalFooter>
    </Modal>
  );
}

export default function PromiseDetail() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState<string>("");
  const promise = useAtomValue(promiseState);
  if (promise === null) {
    return (
      <VStack
        bgColor="primary"
        px={8}
        py={12}
        minH="100vh"
        gap={8}
        alignItems="center"
      >
        <Loading color="white" fontSize="lg" speed="0.65s" />
      </VStack>
    );
  }
  const status = defineStatus(promise, promise.id);

  const handleAction = (type: string) => {
    setAction(type);
    onOpen();
  };

  const handleConfirm = () => {
    if (action === "promise") {
    } else if (action === "cancel") {
    }
    onClose();
  };

  return (
    <VStack
      bgColor={`${status.baseColor}.500`}
      p={8}
      minH="100vh"
      gap={8}
      alignItems="center"
    >
      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        title={action === "promise" ? "約束をプチる" : "キャンセル"}
        message={
          action === "promise"
            ? "約束を結びます。よろしいですか？"
            : "キャンセルします。よろしいですか？"
        }
        onConfirm={handleConfirm}
      />
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
        <VStack>
          <Button
            colorScheme="primary"
            size="lg"
            fontWeight={800}
            rounded="full"
            onClick={() => handleAction("promise")}
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
            onClick={() => handleAction("cancel")}
          >
            キャンセルする
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
