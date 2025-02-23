import React from "react";
import { Box, Container } from "@yamada-ui/react";

interface PromiseContentsProps {
  sender: string;
  receiver: string;
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
    <Box padding="16px" border="1px solid #ccc" borderRadius="8px">
      <Container variant="h6">
        約束した人の名前 : {sender} - {receiver}
      </Container>
      <Container variant="body1">内容 : {content}</Container>
      <Container variant="body2">期限 : {deadline}まで</Container>
    </Box>
  );
};

export default PromiseContents;
