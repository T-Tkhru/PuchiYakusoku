import { Container, Heading, Image } from "@yamada-ui/react";

export const Header = () => {
  return (
    // <Heading size="lg" textAlign="center" p="4">
    //   プチ約束
    // </Heading>
    <Container variant="h4" textAlign="center" p={4}>
      <Image src="header.jpg" alt="プチ約束" />
    </Container>
  );
};
