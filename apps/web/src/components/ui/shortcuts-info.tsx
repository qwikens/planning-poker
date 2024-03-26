import { Button } from "@/components/ui/button.tsx";
import { DialogTrigger } from "@/components/ui/dialog.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { Kbd } from "@/components/ui/kbd.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useHotkeys, useMediaQuery, useOs } from "@mantine/hooks";
import { useState } from "react";
import * as React from "react";

export function ShortcutsInfo({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useHotkeys([["Shift+?", () => setOpen((o) => !o)]]);

  const isMac = useOs() === "macos";

  const os = isMac ? "Cmd" : "Ctrl";

  if (isDesktop) {
    return (
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className="max-w-[95vw]  lg:max-w-[740px] w-full p-6 rounded-xl lg:ml-5"
          sideOffset={10}
          data-label={"help-dialog"}
        >
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] grid-cols-1">
            <div className={"flex gap-4 flex-col"}>
              <h3 className="font-semibold text-md ">About</h3>
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
              <h3 className="mb-2 font-semibold text-md">Shortcuts</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>
                    Open issues panel
                  </span>
                  <Kbd>i</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>
                    Close issues panel
                  </span>
                  <Kbd>Escape</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>
                    Create issue / Focus input
                  </span>
                  <Kbd>c</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>Delete issue</span>
                  <Kbd>{os} + Backspace</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>
                    Delete all issues
                  </span>
                  <Kbd>{os} + Shift + Backspace</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>Undo</span>
                  <Kbd>{os} + Z</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>Redo</span>
                  <Kbd>{os} + Shift + Z</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>
                    Vote next issue
                  </span>
                  <Kbd>n</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>Reveal cards</span>
                  <Kbd>r</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>Vote again</span>
                  <Kbd>v</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>Voting option</span>
                  <Kbd>1,2,3,4,5,6,7,8,9,0</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={"text-sm font-semibold"}>
                    Focus next issue
                  </span>
                  <Kbd>J / arrow down</Kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>About</DrawerTitle>
        </DrawerHeader>
        <div className={"flex gap-4 flex-col px-4 pb-4"}>
          <span className={"flex flex-wrap text-sm"}>
            Qwikens is a boilerplate to easily create real-time applications
            powered by Yjs and HocusPocus. This app uses, React, Shadcn/ui,
            Mantine hooks and TailwindCSS.
          </span>

          <span className={"flex flex-wrap text-sm"}>
            It works out of the box, no need to install anything. Just share the
            URL and start collaborating.
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
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
