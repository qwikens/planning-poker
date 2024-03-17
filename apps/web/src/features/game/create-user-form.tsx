import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { useDocuments } from "@/hooks/useRealtime.tsx";
import {
  createSession,
  getGuestName,
  getSession,
  saveGuestName,
} from "@/lib/session";
import { state } from "@/store.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const createUserSchema = z.object({
  userName: z.string().trim().min(1),
});
type CreateUserFormInput = z.input<typeof createUserSchema>;
type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const CreateUserForm = ({ roomId }: { roomId: string }) => {
  const navigate = useNavigate();
  const { room } = useDocuments();
  const form = useForm<CreateUserFormInput, unknown, CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userName: getGuestName() ?? "",
    },
  });

  const onCreateUser = (values: CreateUserFormValues) => {
    const { userName } = values;

    const user = {
      id: getSession() ?? createSession(),
      name: userName,
    };
    saveGuestName(userName);
    room.set(roomId, {
      ...state.room[roomId],
      participants: [...(state.room[roomId]?.participants ?? []), user],
    });

    navigate(`/${roomId}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onCreateUser)}
        className="max-w-[430px] w-full mx-auto px-4 py-2"
      >
        <div className="flex flex-col justify-between h-full gap-2">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="User Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Join</Button>
        </div>
      </form>
    </Form>
  );
};
