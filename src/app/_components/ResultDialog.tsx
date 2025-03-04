import {
  Button,
  Container,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Text,
  VStack,
} from "@yamada-ui/react";

interface ResultDialogProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  animeComponent?: React.ReactNode;
}
export const ResultDialog: React.FC<ResultDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  animeComponent,
}) => {
  const headerBg = type === "success" ? "primary" : "#ff8c93";
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader bg={headerBg} color="white" fontWeight="bold" pb={2}>
        {title}
      </DialogHeader>
      <DialogBody>
        <VStack>
          {animeComponent && (
            <Container alignItems={"center"} p={4}>
              {animeComponent}
            </Container>
          )}
          <Text>{message}</Text>
        </VStack>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={onClose}
          colorScheme={type === "success" ? "primary" : "warning"}
        >
          OK
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
