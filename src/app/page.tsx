import { slides, StoryLoading } from "./_components/Welcome";

export default function Root() {
  return <StoryLoading slides={slides} interval={3000} />;
}
