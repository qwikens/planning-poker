import { NetworkStatus } from "@/components/ui/network-status.tsx";
import { state } from "@/store.ts";
import { useSnapshot } from "valtio";
import { QwikensLogoSvg } from "@/components/qwikens-logo-svg.tsx";
import { TextAnimatedGradient } from "@/components/ui/text-animated.tsx";

export const HeaderLeft = ({ id }: { id?: string } = {}) => {
	const { room } = useSnapshot(state);
	const currentRoom = room[id ?? ""];

	return (
		<div className="flex items-center gap-4">
			<div className="relative flex items-center">
				<QwikensLogoSvg />
				<NetworkStatus />
			</div>

			{currentRoom?.name ? (
				<TextAnimatedGradient>{currentRoom.name}</TextAnimatedGradient>
			) : null}
		</div>
	);
};
