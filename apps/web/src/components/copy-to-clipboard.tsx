import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { useClipboard } from "@mantine/hooks";

function CopiedSVG() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Copied</title>

      <path
        d="M22 11.1V6.9C22 3.4 20.6 2 17.1 2h-4.2C9.4 2 8 3.4 8 6.9V8h3.1c3.5 0 4.9 1.4 4.9 4.9V16h1.1c3.5 0 4.9-1.4 4.9-4.9z"
        stroke="currentColor"
      />
      <path
        d="M16 17.1v-4.2C16 9.4 14.6 8 11.1 8H6.9C3.4 8 2 9.4 2 12.9v4.2C2 20.6 3.4 22 6.9 22h4.2c3.5 0 4.9-1.4 4.9-4.9z"
        stroke="currentColor"
      />
      <path d="M6.08 15l1.95 1.95 3.89-3.9" stroke="currentColor" />
    </svg>
  );
}

function CopySVG() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Copy</title>

      <path
        d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9H6.9C3.4 22 2 20.6 2 17.1v-4.2C2 9.4 3.4 8 6.9 8h4.2c3.5 0 4.9 1.4 4.9 4.9z"
        stroke="currentColor"
      />
      <path
        d="M22 6.9v4.2c0 3.5-1.4 4.9-4.9 4.9H16v-3.1C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2h4.2C20.6 2 22 3.4 22 6.9z"
        stroke="currentColor"
      />
    </svg>
  );
}

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
