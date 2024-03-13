import { useNetwork } from "@mantine/hooks";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const NetworkStatus = () => {
  const { online } = useNetwork();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            aria-label={`Network Status Indicator - ${
              online ? "Online" : "Offline"
            }`}
            className={cn(
              "w-2 h-2 rounded-full absolute bottom-0 left-0",
              online ? "bg-green-500" : "bg-red-500",
            )}
          />
        </TooltipTrigger>
        <TooltipContent sideOffset={20}>
          <p>You are {online ? "online" : "offline"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
