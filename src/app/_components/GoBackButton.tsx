"use client";
import { HouseIcon } from "@yamada-ui/lucide";
import { HStack, Icon } from "@yamada-ui/react";
import Link from "next/link";

interface BackButtonProps {
  color?: string;
}

export function BackButton({ color }: BackButtonProps) {
  return (
    <HStack w="full">
      <Link href="/home">
        <Icon
          variant="ghost"
          size="xl"
          rounded="full"
          fontSize="xl"
          p={4}
          as={HouseIcon}
          color={color ? color : "black"}
        ></Icon>
      </Link>
    </HStack>
  );
}
