import { UserSimpleProfile } from "@/lib/type";
import { Avatar, Card, CardBody, Text, VStack } from "@yamada-ui/react";

interface CardProps {
  user: UserSimpleProfile;
}

export const UserCard = ({ user }: CardProps) => {
  return (
    <Card w="sm">
      <CardBody>
        <VStack alignItems="center">
          <Avatar src={user.image} size={"xl"} />
          <Text>{user.name}さん</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};
