import {
  Button,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from "@yamada-ui/react";

interface ResultDialogProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}
export const ResultDialog: React.FC<ResultDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
}) => {
  const headerBg = type === "success" ? "primary" : "danger";
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogOverlay />
      <Dialog>
        <DialogHeader bg={headerBg} color="white" fontWeight="bold">
          {title}
        </DialogHeader>
        <DialogCloseButton />
        <DialogBody>{message}</DialogBody>
        <DialogFooter>
          <Button
            onClick={onClose}
            colorScheme={type === "success" ? "primary" : "danger"}
          >
            OK
          </Button>
        </DialogFooter>
      </Dialog>
    </Dialog>
  );
};
