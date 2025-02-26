import { Avatar, Tooltip } from "@yamada-ui/react";

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
    <Tooltip
      label={`${user.displayName}`}
      isOpen
      boxShadow={"none"}
      border={"none"}
    >
      <Avatar
        src={user.pictureUrl}
        size={size}
        border="4px solid"
        borderColor={color}
      />
    </Tooltip>
  );
};
