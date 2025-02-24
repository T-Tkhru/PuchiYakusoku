import { Container, Image } from "@yamada-ui/react";

interface ImageWrapperProps {
  src: string;
  alt: string;
}

export const ImageWrapper = ({ src, alt }: ImageWrapperProps) => {
  return (
    <Container p={4}>
      <Image src={src} alt={alt} />
    </Container>
  );
};
