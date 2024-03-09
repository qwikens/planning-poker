import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useHocusPocus } from "@/hooks/useHocuspocus.tsx";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import { state } from "@/store.ts";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const CreateUserSchema = z.object({
	userName: z.string().trim().min(1),
});
export const CreateUserForm = ({ roomId }: { roomId: string }) => {
	const navigate = useNavigate();
	const { clientId } = useHocusPocus();

	const { room } = useDocuments();

	const onCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const userName = formData.get("userName");

		try {
			const data = CreateUserSchema.parse({
				userName,
			});

			const user = {
				id: String(clientId),
				name: data.userName,
				online: true,
			};

			room.set(roomId, {
				...state.room[roomId],
				participants: [...(state.room[roomId]?.participants ?? []), user],
			});

			localStorage.setItem("guestUser", data.userName);

			navigate(`/${roomId}`);
		} catch (error) {
			return;
		}
	};

	return (
		<form
			onSubmit={onCreateUser}
			className="max-w-[430px] w-full mx-auto px-4 py-2 "
		>
			<div className="flex flex-col justify-between h-full gap-2">
				<Input
					type="text"
					placeholder="User Name"
					name="userName"
					defaultValue={localStorage.getItem("guestUser") ?? ""}
				/>
				<Button type="submit">Create</Button>
			</div>
		</form>
	);
};
