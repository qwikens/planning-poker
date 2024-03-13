import { Kbd } from "@/components/ui/kbd.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useHotkeys } from "@mantine/hooks";
import { useState } from "react";

export function ShortcutsInfo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useHotkeys([["Shift+?", () => setOpen((o) => !o)]]);

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="max-w-[95vw]  lg:max-w-[740px] w-full p-6 rounded-xl lg:ml-5"
        sideOffset={10}
      >
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] grid-cols-1">
          <div className={"flex gap-4 flex-col"}>
            <h3 className="text-md font-semibold ">About</h3>
            <span className={"flex flex-wrap text-sm"}>
              Qwikens is a boilerplate to easily create real-time applications
              powered by Yjs and HocusPocus. This app uses, React, Shadcn/ui,
              Mantine hooks and TailwindCSS.
            </span>

            <span className={"flex flex-wrap text-sm"}>
              It works out of the box, no need to install anything. Just share
              the URL and start collaborating.
            </span>

            <span className={"flex flex-wrap text-sm"}>
              The source code is available on{" "}
              <a
                href="https://github.com/qwikens/planning-poker"
                className="ml-1 text-primary"
                target={"_blank"}
                rel="noreferrer"
              >
                GitHub
              </a>
            </span>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-2">Shortcuts</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>
                  Open issues panel
                </span>
                <Kbd>i</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>
                  Close issues panel
                </span>
                <Kbd>Escape</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>
                  Create issue / Focus input
                </span>
                <Kbd>c</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>Delete issue</span>
                <Kbd>Cmd + Backspace</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>
                  Delete all issues
                </span>
                <Kbd>Cmd + Shift + Backspace</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>Undo</span>
                <Kbd>Cmd + Z</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>Redo</span>
                <Kbd>Cmd + Shift + Z</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>Vote next issue</span>
                <Kbd>n</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>Reveal cards</span>
                <Kbd>r</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>Voting option</span>
                <Kbd>1,2,3,4,5,6,7,8,9,0</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>
                  Focus next issue
                </span>
                <Kbd>J / arrow down</Kbd>
              </div>

              <div className="flex items-center gap-2 justify-between">
                <span className={"text-sm font-semibold"}>
                  Focus previous issue
                </span>
                <Kbd>K / arrow up</Kbd>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
