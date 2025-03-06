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
  color = "pink.400",
}: CardProps) => {
  return (
    <Tooltip
      label={user ? `${user.displayName}` : "ともだち"}
      isOpen
      boxShadow={"none"}
      border={"none"}
      zIndex={1}
    >
      <Avatar
        src={
          user
            ? user.pictureUrl
            : "https://i.gyazo.com/e0b8d96b303094a01ebd5fc4aa530ed4.jpg"
        }
        size={size}
        border="4px solid"
        borderColor={color}
        color="gray.100"
      />
    </Tooltip>
  );
};
