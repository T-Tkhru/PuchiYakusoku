import { Avatar, Tooltip, VStack } from "@yamada-ui/react";

import { UserProfile } from "@/lib/type";

interface CardProps {
  user: UserProfile;
  size?: string;
  color?: string;
}

export const UserCard = ({
  user,
  size = "lg",
  color = "orange.400",
}: CardProps) => {
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
          size={size}
          border="2px solid"
          borderColor={color}
        />
      </Tooltip>
    </VStack>
  );
};
