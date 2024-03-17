import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/theme-provider";
import { clearSession } from "@/lib/session";
import { useMediaQuery } from "@mantine/hooks";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { GameSettingsModal } from "../features/game/game-settings-modal";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Drawer, DrawerTrigger } from "./ui/drawer";

export function PreferencesDropdownMenu({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const navigation = useNavigate();
  const [settingOpen, setSettingsOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dropDownRef = React.useRef<HTMLButtonElement>(null);
  const { setTheme, theme: currentTheme } = useTheme();

  const closeModal = () => {
    setSettingsOpen(false);
    console.log(dropDownRef.current);
    dropDownRef.current?.focus();
  };

  const Wrapper = isDesktop ? Dialog : Drawer;
  const Trigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <Wrapper
      open={settingOpen}
      onOpenChange={(value) => {
        setSettingsOpen(value);
      }}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild ref={dropDownRef} id={"game-settings"}>
          <Button variant={"secondary"}>{children}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[200px]"
          sideOffset={10}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Trigger>
                <span>Game settings</span>
              </Trigger>
            </DropdownMenuItem>

            {id ? (
              <DropdownMenuItem
                onClick={() => {
                  navigation(`/${id}/history`);
                }}
              >
                <span>Voting history</span>
              </DropdownMenuItem>
            ) : null}

            <DropdownMenuItem
              onClick={() => {
                setTheme(currentTheme === "dark" ? "light" : "dark");
              }}
            >
              <span>Toggle theme</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                clearSession();
                navigation("/");
              }}
            >
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <GameSettingsModal closeModal={closeModal} />
    </Wrapper>
  );
}
