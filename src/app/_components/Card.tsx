import { Avatar, Tooltip, VStack } from "@yamada-ui/react";

import { UserProfile } from "@/lib/type";

interface CardProps {
  user: UserProfile;
}

export const UserCard = ({ user }: CardProps) => {
  return (
    <VStack alignItems="center" gap={1}>
      <Tooltip
        label={`${user.displayName}`}
        isOpen
        boxShadow={"none"}
        border={"none"}
      >
        <Avatar
          src={user.pictureUrl}
          size={"xl"}
          border="2px solid"
          borderColor="orange.400"
        />
      </Tooltip>
    </VStack>
  );
};
