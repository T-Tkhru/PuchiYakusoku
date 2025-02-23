import { Avatar, Card, CardBody, HStack, Text, VStack } from "@yamada-ui/react";

import { UserSimpleProfile } from "@/lib/type";

interface CardProps {
  sender: UserSimpleProfile;
  receiver: UserSimpleProfile;
}

export const UserCard = ({ sender, receiver }: CardProps) => {
  return (
    <VStack alignItems="center" gap={1}>
      <HStack>
        <Avatar
          src={sender.image}
          size={"xl"}
          border="2px solid"
          borderColor="orange.400"
        />
      </HStack>

      <Text>{sender.name}さん</Text>
    </VStack>
  );
};
