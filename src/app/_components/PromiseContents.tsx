import React from "react";
import { Box, Container, Heading, HStack, Text } from "@yamada-ui/react";
import { UserSimpleProfile } from "@/lib/type";
import { UserCard } from "./Card";

interface PromiseContentsProps {
  sender: UserSimpleProfile;
  receiver: UserSimpleProfile;
  content: string;
  deadline: string;
}

const PromiseContents: React.FC<PromiseContentsProps> = ({
  sender,
  receiver,
  content,
  deadline,
}) => {
  return (
    <Container>
      {sender ? (
        <HStack>
          <UserCard user={sender} />
          <Text fontSize="6xl">が</Text>
          <UserCard user={receiver} />
          <Text fontSize="6xl">に</Text>
        </HStack>
      ) : (
        <Heading size="md" p={4}>
          ようこそ、ゲストさん
        </Heading>
      )}
    </Container>
    // <Box padding="16px" border="1px solid #ccc" borderRadius="8px">
    //   <Container variant="h6">
    //     約束した人の名前 : {sender} - {receiver}
    //   </Container>
    //   <Container variant="body1">内容 : {content}</Container>
    //   <Container variant="body2">期限 : {deadline}まで</Container>
    // </Box>
  );
};

export default PromiseContents;
