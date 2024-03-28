import { QwikensLogoSvg } from "@/components/qwikens-logo-svg.tsx";
import { NetworkStatus } from "@/components/ui/network-status.tsx";
import { TextAnimatedGradient } from "@/components/ui/text-animated.tsx";
import { state } from "@/store.ts";
import { useSnapshot } from "valtio";
import { PreferencesDropdownMenu } from "./preferences-dropdown";

export const HeaderLeft = ({
  roomId,
  isAuthenticated,
}: { roomId?: string; isAuthenticated?: boolean } = {}) => {
  const { name } = useSnapshot(state);

  return (
    <div className="flex items-center gap-4 w-fit">
      <div className="relative flex items-center text-primary">
        <QwikensLogoSvg />
        <NetworkStatus />
      </div>

      {name && isAuthenticated ? (
        <PreferencesDropdownMenu roomId={roomId}>
          <TextAnimatedGradient>{name}</TextAnimatedGradient>
        </PreferencesDropdownMenu>
      ) : name ? (
        <TextAnimatedGradient>{name}</TextAnimatedGradient>
      ) : null}
    </div>
  );
};
