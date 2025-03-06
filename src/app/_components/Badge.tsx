import { Box, HStack, Icon, Text, VStack } from "@yamada-ui/react";

interface BadgeProps {
  icon: React.ComponentType;
  text: string;
  label: string;
}
export const Badge = ({ icon, text, label }: BadgeProps) => {
  return (
    <HStack
      fontSize="sm"
      fontWeight="bold"
      px={4}
      py={2}
      border="2px solid"
      borderColor="border"
      rounded="md"
    >
      <VStack gap={0}>
        <Text fontSize={24} fontWeight={600}>
          {text}
        </Text>
        <Text fontSize={12} color="gray">
          {label}
        </Text>
      </VStack>
      <Icon as={icon} ml={1} />
    </HStack>
  );
};
