import { useNavigate } from "react-router-dom";

import { HeaderLeft } from "@/components/header-left.tsx";
import { Button } from "@/components/ui/button";

export const Component = () => {
	const navigate = useNavigate();
	const createRoom = () => navigate("/new-game");

	return (
		<div>
			<nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
				<HeaderLeft />
			</nav>

			<div className="flex flex-col max-w-[430px] w-full mt-10 gap-4 px-4 mx-auto">
				<Button onClick={createRoom}>Start new game</Button>
			</div>
		</div>
	);
};
Component.displayName = "App";
