"use client";
import { HouseIcon } from "@yamada-ui/lucide";
import { HStack, Icon, IconButton } from "@yamada-ui/react";
import { useRouter } from "next/navigation";

interface HomeButtonProps {
  color?: string;
}

export function HomeButton({ color }: HomeButtonProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push("/home");
  };
  return (
    <HStack w="full">
      <IconButton
        rounded="full"
        fontSize="2xl"
        p={2}
        variant={"ghost"}
        onClick={handleClick}
        icon={<Icon as={HouseIcon} color={color ? color : "neutral.500"} />}
        _active={{
          backgroundColor: "blackAlpha.700",
        }}
      ></IconButton>
    </HStack>
  );
}
