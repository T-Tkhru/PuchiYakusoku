"use client";

import { Box, Button, Image, Progress, Text, VStack } from "@yamada-ui/react";
import React, { memo, useEffect, useState } from "react";

type StoryLoadingProps = {
  slides: React.ReactNode[];
  interval?: number;
};

const SlideDisplay = memo(({ slide }: { slide: React.ReactNode }) => (
  <Box
    mt="50px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100%"
    transition="transform 0.5s"
  >
    {slide}
  </Box>
));
SlideDisplay.displayName = "SlideDisplay";

export const StoryLoading: React.FC<StoryLoadingProps> = ({
  slides,
  interval = 3000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateInterval = 50;
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const increment = (updateInterval / interval) * 100;
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          setCurrentSlide((currentSlide + 1) % slides.length);
          return 0;
        }
        return newProgress;
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [interval, currentSlide, slides.length]);

  return (
    <VStack
      px={8}
      py={4}
      minH="100vh"
      gap={8}
      alignItems="center"
      height="100%"
    >
      <Box position="relative" width="100%" height="100%">
        <Box
          position="absolute"
          top={2}
          left={2}
          right={2}
          display="flex"
          gap={2}
        >
          {slides.map((_, index) => (
            <Box key={index} flex="1">
              <Progress
                value={
                  index < currentSlide
                    ? 100
                    : index === currentSlide
                      ? progress
                      : 0
                }
                size="md"
                colorScheme="primary"
                borderRadius="md"
                aria-label={`Slide ${index + 1} progress`}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <SlideDisplay slide={slides[currentSlide]} />
    </VStack>
  );
};

const FirstStory: React.FC = () => {
  return (
    <VStack h="full" gap={32} py={24} fontSize="32" fontWeight="800">
      <Image src="/logo_icon.png" alt="loading" width={300} height={300} />
      <VStack gap={4}>
        <Text>約束で困ったを無くす</Text>
        <Text>SNSに近いアプリ</Text>
      </VStack>
    </VStack>
  );
};

const SecondStory: React.FC = () => {
  return (
    <VStack h="full" gap={32} py={24} fontSize="32" fontWeight="800">
      <Image src="/mail.svg" alt="loading" width={300} height={300} />
      <VStack gap={4}>
        <Text>さあ、約束をプチろう</Text>
        <Button
          py={4}
          colorScheme="secondary"
          rounded="full"
          size="lg"
          fontWeight={800}
          boxShadow="0px 6px #EB777B"
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "pink.800",
            boxshadow: "none",
          }}
        >
          今すぐ始める
        </Button>
      </VStack>
    </VStack>
  );
};

export const slides = [<FirstStory key="1" />, <SecondStory key="2" />];
