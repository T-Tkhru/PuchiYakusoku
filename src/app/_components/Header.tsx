import { Container, Image } from "@yamada-ui/react";

export const Header = () => {
  return (
    <Container variant="h4" textAlign="center" p={4}>
      <Image src="header.jpg" alt="プチ約束" />
    </Container>
  );
};
