"use client";

import { Level } from "@prisma/client";
import {
  Avatar,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Separator,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { HomeButton } from "@/app/_components/GoBackButton";
import { PromiseContents } from "@/app/_components/PromiseContents";
import { ResultDialog } from "@/app/_components/ResultDialog";
import { useLiff } from "@/app/providers/LiffProvider";
import {
  useAcceptPromiseMutation,
  useCancelPromiseMutation,
  useCompletePromiseMutation,
  useRejectPromiseMutation,
} from "@/generated/graphql";
import { usePromiseList } from "@/hooks/usePromiseList";
import { promiseState } from "@/lib/jotai_state";
import { sendMessage } from "@/lib/request";
import {
  defineStatus,
  headerMessage,
  imageSource,
  StatusEnum,
} from "@/lib/status";
import { Promise as TypePromise, PromiseSchema, UserProfile } from "@/lib/type";

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
              boxShadow: "none",
            }}
          >
            OK
          </Button>
          <Button
            colorScheme="gray"
            size="sm"
            onClick={onClose}
            boxShadow={"0px 4px #9C9C9CFF"}
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "gray.50",
              boxShadow: "none",
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
        bgColor="white"
        px={12}
        py={12}
        minH="100vh"
        gap={8}
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight={800}>
          約束データを取得中...
        </Text>
        <Image src="/loading_icon.png" alt="loading" width={200} height={200} />
      </VStack>
    );
  }
  const status = defineStatus(promise, user!);
  console.log(promise);
  return (
    <VStack
      style={{
        backgroundImage: status.bgImage ? `url(${status.bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      bgColor={!status.bgImage ? status.baseColor || "white" : undefined}
      px={8}
      py={4}
      minH="100vh"
      gap={8}
      alignItems="center"
    >
      <VStack gap={0} alignItems="center">
        <HomeButton color={status.textColor} />
        <Image
          src={imageSource(status)}
          alt="mail icon"
          width={200}
          height={200}
          objectFit="contain"
        />
      </VStack>
      <HStack color="white" gap={4}>
        <Avatar
          src={promise.sender?.pictureUrl as string}
          size="lg"
          border="4px solid"
          borderColor="white"
        />
        <VStack alignItems="flex-start" gap={2}>
          <Text fontWeight={600} fontSize="2xl" color={status.textColor}>
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
        <Separator
          orientation="horizontal"
          borderWidth="2px"
          color={status.textColor}
        />
      </VStack>
      <PromiseContents
        sender={promise.sender}
        receiver={promise.receiver}
        direction={!promise.direction}
        content={promise.content as string}
        deadline={promise.dueDate}
        level={promise.level as Level}
        baseColor={status.baseColor == null ? null : `${status.baseColor}.500`}
        textColor={status.textColor}
        isShare={promise.isShare}
      />
      <VStack w="full">
        {status.status === StatusEnum.PENDING_RECEIVER && (
          <UnReadStatusButtons promise={promise} />
        )}
        {status.status === StatusEnum.IS_ACCEPTED && user && (
          <IsAcceptedStatusButtons promise={promise} user={user} />
        )}
        {status.status === StatusEnum.PENDING_SENDER && user && (
          <MyPromiseButtons promise={promise} />
        )}
        {status.status === StatusEnum.IS_COMPLETED && user && (
          <IsCompletedStatusButtons promise={promise} user={user} />
        )}
      </VStack>
    </VStack>
  );
}

interface ActionButtonProps {
  promise: TypePromise;
}

const UnReadStatusButtons = ({ promise }: ActionButtonProps) => {
  const router = useRouter();
  const setPromise = useSetAtom(promiseState);
  const [isOpen, setIsOpen] = useState<"accept" | "cancel" | null>(null);
  const { removePromiseById, addPromise } = usePromiseList();

  const [acceptPromise] = useAcceptPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "成功",
        message: "約束が正常にプチられました！",
        onClose: () => {
          const updatePromise = PromiseSchema.parse(promise);
          updatePromise.isAccepted = true;
          setPromise(updatePromise);
          addPromise(updatePromise);
          setResultDialog({ ...resultDialog, isOpen: false });
          setIsOpen(null);
        },
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "約束処理中にエラーが発生しました。",
        onClose: () => {
          setResultDialog({ ...resultDialog, isOpen: false });
          setIsOpen(null);
        },
      });
    },
  });
  const [cancelPromise] = useCancelPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "キャンセル成功",
        message: "約束がキャンセルされました...",
        onClose: () => {
          removePromiseById(promise.id);
          router.push("/home");
        },
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "キャンセル処理中にエラーが発生しました。",
        onClose: () => {
          setResultDialog({ ...resultDialog, isOpen: false });
          setIsOpen(null);
        },
      });
    },
  });

  const [rejectPromise] = useRejectPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "拒否成功",
        message: "約束が拒否されました...",
        onClose: () => {
          removePromiseById(promise.id);
          router.push("/home");
        },
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "拒否しようとしたらエラーが発生しました。",
        onClose: () => {
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    },
  });

  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onClose: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onClose: () => {},
  });

  const handlePromise = async () => {
    await acceptPromise({ variables: { id: promise.id } });
  };

  const handleCancel = async () => {
    await cancelPromise({ variables: { id: promise.id } });
  };
  const handleReject = async () => {
    await rejectPromise({ variables: { id: promise.id } });
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
      <ActionModal
        isOpen={isOpen === "cancel"}
        onClose={() => setIsOpen(null)}
        title="拒否"
        message="約束を拒否します。よろしいですか？"
        onConfirm={handleReject}
      />
      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={resultDialog.onClose}
      />
      <VStack>
        <Button
          colorScheme="primary"
          size="lg"
          fontWeight={800}
          rounded="full"
          onClick={() => setIsOpen("accept")}
          boxShadow="0px 6px teal"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "teal.800",
            boxShadow: "none",
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
            backgroundColor: "blackAlpha.400",
            boxShadow: "none",
          }}
        >
          約束しない
        </Button>
      </VStack>
    </VStack>
  );
};

const IsAcceptedStatusButtons = ({
  promise,
  user,
}: {
  promise: TypePromise;
  user: UserProfile;
}) => {
  const [isOpen, setIsOpen] = useState<"cancel" | "remind" | "complete" | null>(
    null
  );
  const router = useRouter();
  const setPromise = useSetAtom(promiseState);
  const { removePromiseById } = usePromiseList();

  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onClose: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onClose: () => {
      setIsOpen(null);
    },
  });

  const [completePromise] = useCompletePromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "約束達成！",
        message: "約束が達成されました！",
        onClose: () => {
          setIsOpen(null);
          removePromiseById(promise.id);
          const updatePromise = PromiseSchema.parse(promise);
          updatePromise.completedAt = new Date().toISOString();
          setPromise(updatePromise);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "達成処理中にエラーが発生しました。",
        onClose: () => {
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    },
  });

  const [cancelPromise] = useCancelPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "キャンセル成功",
        message: "約束がキャンセルされました...",
        onClose: () => {
          removePromiseById(promise.id);
          router.push("/home");
        },
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "キャンセルしようとしたらエラーが発生しました。",
        onClose: () => {
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    },
  });

  const handleComplete = async () => {
    await completePromise({ variables: { id: promise.id } });
  };

  const handleCancel = async () => {
    await cancelPromise({ variables: { id: promise.id } });
    removePromiseById(promise.id);
    router.push("/home");
    setIsOpen(null);
  };

  const handleRemind = async (user: UserProfile, promise: TypePromise) => {
    try {
      await sendMessage(
        user,
        promise,
        "もしかしたら約束...忘れてない...?",
        true
      );
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "リマインドしたよ！",
        message: "相手はあなたが送ったとは気づいていません。",
        onClose: () => {
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    } catch (error) {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "メッセージ送信中にエラーが発生しました。",
        onClose: () => {
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
      alert(error);
    }
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
        onClose={resultDialog.onClose}
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
          onClick={() => handleRemind(user, promise)}
          boxShadow="0px 6px white"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "blackAlpha.400",
            boxShadow: "none",
          }}
        >
          リマインド
        </Button>
        <Button
          rounded="full"
          variant="outline"
          color="primary"
          borderColor="white"
          colorScheme="blackAlpha"
          backgroundColor="white"
          size="lg"
          fontWeight={800}
          onClick={handleComplete}
          boxShadow="0px 6px teal"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "white",
            boxShadow: "none",
          }}
        >
          約束を果たした
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
            backgroundColor: "blackAlpha.400",
            boxShadow: "none",
          }}
        >
          約束をキャンセルする
        </Button>
      </VStack>
    </VStack>
  );
};

const MyPromiseButtons = ({ promise }: { promise: TypePromise }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<"cancel" | "remind" | "complete" | null>(
    null
  );
  const { removePromiseById } = usePromiseList();
  const [cancelPromise] = useCancelPromiseMutation({
    onCompleted: () => {
      setResultDialog({
        isOpen: true,
        type: "success",
        title: "キャンセル成功",
        message: "約束がキャンセルされました。",
        onClose() {
          removePromiseById(promise.id);
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    },
    onError: () => {
      setResultDialog({
        isOpen: true,
        type: "error",
        title: "エラー",
        message: "キャンセル処理中にエラーが発生しました。",
        onClose() {
          setIsOpen(null);
          setResultDialog({ ...resultDialog, isOpen: false });
        },
      });
    },
  });
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    onClose: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onClose: () => {},
  });

  const handleCancel = async () => {
    await cancelPromise({
      variables: {
        id: promise.id,
      },
    });
    removePromiseById(promise.id);
    setIsOpen(null);
    router.push("/home");
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
        onClose={resultDialog.onClose}
      />
      <VStack>
        <Button
          rounded="full"
          variant="solid"
          color="white"
          colorScheme="teal"
          backgroundColor="teal.500"
          size="lg"
          fontWeight={800}
          onClick={() => setIsOpen("cancel")}
          boxShadow="0px 6px teal"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "teal.600",
            boxShadow: "none",
          }}
        >
          約束をキャンセルする
        </Button>
      </VStack>
    </VStack>
  );
};

const IsCompletedStatusButtons = ({
  promise,
  user,
}: {
  promise: TypePromise;
  user: UserProfile;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  const handleThank = async (user: UserProfile) => {
    try {
      await sendMessage(user, promise, "ありがとう！", false);
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
    setResultDialog({ ...resultDialog, isOpen: false });
  };

  return (
    <React.Fragment>
      <ActionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="ありがとうを伝える"
        message="お礼を言います。よろしいですか？"
        onConfirm={() => handleThank(user)}
      />

      <ResultDialog
        isOpen={resultDialog.isOpen}
        type={resultDialog.type}
        title={resultDialog.title}
        message={resultDialog.message}
        onClose={() => setResultDialog({ ...resultDialog, isOpen: false })}
      />
      {/* <Button
        rounded="full"
        color="white"
        colorScheme="amber"
        backgroundColor="amber.500"
        size="lg"
        fontWeight={800}
        onClick={() => {}}
        boxShadow="0px 6px #95710f"
        _active={{
          transform: "translateY(2px)",
          backgroundColor: "blackAlpha.400",
          boxShadow: "none",
        }}
      >
        お礼を言う
      </Button> */}
    </React.Fragment>
  );
};
