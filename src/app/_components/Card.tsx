import { Avatar, Tooltip } from "@yamada-ui/react";

import { UserProfile } from "@/lib/type";

interface CardProps {
  user: UserProfile | null;
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
      label={user ? `${user.displayName}` : "友達"}
      isOpen
      boxShadow={"none"}
      border={"none"}
      zIndex={1}
    >
      <Avatar
        src={user ? user.pictureUrl : "https://not-found.com"}
        size={size}
        border="4px solid"
        borderColor={color}
      />
    </Tooltip>
  );
};
