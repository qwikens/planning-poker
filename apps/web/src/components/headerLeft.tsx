import { NetworkStatus } from "@/components/ui/network-status.tsx";
import { TextAnimatedGradient } from "@/components/ui/text-animated.tsx";
import { state } from "@/store.ts";
import { useSnapshot } from "valtio";

function QwikensLogoSVG() {
	return (
		<svg
			width={24}
			height={26}
			viewBox="0 0 24 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Logo</title>

			<path
				d="M24 26h-5.806c-2.05-2.146-5.85-6.456-5.85-6.456a7.29 7.29 0 004.056-1.846 7.783 7.783 0 002.555-5.801c0-2.15-.89-4.234-2.426-5.683-2.31-2.18-6.114-2.635-8.797-.935-2.196 1.39-3.526 3.988-3.55 6.63a7.823 7.823 0 002.101 5.415A7.169 7.169 0 0010.37 19.5l3.779 3.98c-.848.205-1.73.314-2.638.314C5.26 23.796.023 18.415 0 11.951-.023 5.472 5.212 0 11.512 0c6.357 0 11.51 5.327 11.51 11.897 0 3.489-1.453 6.63-3.77 8.806L24 26z"
				fill="#fff"
			/>
			<defs>
				<clipPath id="clip0_82_11">
					<path fill="#fff" d="M0 0H24V26H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}

export const HeaderLeft = ({ id }: { id?: string } = {}) => {
	const { room } = useSnapshot(state);

	const currentRoom = room[id ?? ""];

	return (
		<div className="flex items-center gap-4">
			<div className="relative flex items-center">
				<QwikensLogoSVG />
				<NetworkStatus />
			</div>

			{currentRoom?.name ? (
				<TextAnimatedGradient>{currentRoom.name}</TextAnimatedGradient>
			) : null}
		</div>
	);
};
