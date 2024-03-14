import { QwikensLogoSvg } from "@/components/qwikens-logo-svg.tsx";
import { NetworkStatus } from "@/components/ui/network-status.tsx";
import { TextAnimatedGradient } from "@/components/ui/text-animated.tsx";
import { state } from "@/store.ts";
import { useSnapshot } from "valtio";
import { PreferencesDropdownMenu } from "./preferences-dropdown";

export const HeaderLeft = ({
  id,
  isAuthenticated,
}: { id?: string; isAuthenticated?: boolean } = {}) => {
  const { room } = useSnapshot(state);
  const currentRoom = room[id ?? ""];

  return (
    <div className="flex items-center gap-4 w-fit">
      <div className="relative flex items-center text-primary">
        <QwikensLogoSvg />
        <NetworkStatus />
      </div>

      {currentRoom?.name && isAuthenticated ? (
        <PreferencesDropdownMenu id={id}>
          <TextAnimatedGradient>{currentRoom.name}</TextAnimatedGradient>
        </PreferencesDropdownMenu>
      ) : currentRoom?.name ? (
        <TextAnimatedGradient>{currentRoom.name}</TextAnimatedGradient>
      ) : null}
    </div>
  );
};
