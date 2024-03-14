import { Button } from "@/components/ui/button.tsx";

import { useToast } from "@/components/ui/use-toast.ts";
import { useClipboard } from "@mantine/hooks";

export const CopyToClipboard = ({ url }: { url: string }) => {
  const { copy } = useClipboard();
  const { toast, toasts } = useToast();

  return (
    <Button
      variant={"default"}
      onClick={() => {
        copy(url);

        if (
          toasts.some(
            (toast) =>
              toast.title === "Game URL copied to clipboard" && toast.open,
          )
        )
          return;

        toast({
          title: "Game URL copied to clipboard",
        });
      }}
    >
      Invite players
    </Button>
  );
};
