"use client";
import { ArrowLeftIcon } from "@yamada-ui/lucide";
import { HStack, Icon } from "@yamada-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BackButtonProps {
  color?: string;
}

export function BackButton({ color }: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (!canGoBack) return null;

  return (
    <HStack w="full">
      <Icon
        variant="ghost"
        size="xl"
        rounded="full"
        fontSize="xl"
        p={4}
        as={ArrowLeftIcon}
        onClick={handleBack}
        color={color ? color : "black"}
      ></Icon>
    </HStack>
  );
}
