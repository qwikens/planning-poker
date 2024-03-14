import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import {
  createSession,
  getGuestName,
  getSession,
  saveGuestName,
} from "@/lib/session";
import { state } from "@/store.ts";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const createUserSchema = z.object({
  userName: z.string().trim().min(1),
});
export const CreateUserForm = ({ roomId }: { roomId: string }) => {
  const navigate = useNavigate();

  const { room } = useDocuments();

  const onCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.room[roomId]?.participants?.length >= 6) {
      toast({
        title: "Room is full",
      });
    }

    const formData = new FormData(event.currentTarget);
    const userName = formData.get("userName");

    try {
      const data = createUserSchema.parse({
        userName,
      });

      const user = {
        id: getSession() ?? createSession(),
        name: data.userName,
      };
      saveGuestName(data.userName);
      room.set(roomId, {
        ...state.room[roomId],
        participants: [...(state.room[roomId]?.participants ?? []), user],
      });

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
          defaultValue={getGuestName() ?? ""}
        />
        <Button type="submit">Join</Button>
      </div>
      <Toaster />
    </form>
  );
};
