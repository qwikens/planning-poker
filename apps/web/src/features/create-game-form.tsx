import { HeaderLeft } from "@/components/header-left";
import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { VotingSystemSelect } from "@/components/ui/voting-system-select";
import {
  asymmetricEncrypt,
  generateKeyPair,
  generateSymmetricKey,
} from "@/lib/crypto";
import {
  createRoom,
  createSession,
  getGuestName,
  getSession,
  savePrivateKey,
  saveSymmetricKey,
} from "@/lib/session";
import { ydoc } from "@/yjsDoc.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClipboard } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const createGameSchema = z
  .object({
    gameName: z.string(),
    userName: z.string().min(1),
    votingSystem: z.enum(["fibonacci"]),
  })
  .transform((value) => ({
    ...value,
    gameName:
      value.gameName.length > 0 ? value.gameName : "Planning Poker Game",
  }));
type CreateGameFormInput = z.input<typeof createGameSchema>;
type CreateGameFormValues = z.infer<typeof createGameSchema>;

const CreateGameForm = () => {
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const form = useForm<CreateGameFormInput, unknown, CreateGameFormValues>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      gameName: "",
      userName: getGuestName() ?? "",
      votingSystem: "fibonacci",
    },
  });

  const onCreateGame = async (values: CreateGameFormValues) => {
    const { gameName, userName, votingSystem } = values;
    const roomId = createRoom();

    const user = {
      id: getSession() ?? createSession(),
      name: userName,
    };

    const { privateKey, publicKey } = await generateKeyPair();
    savePrivateKey(privateKey);

    const symmetricKey = generateSymmetricKey();
    saveSymmetricKey(symmetricKey);

    const encryptedSymmetricKey = asymmetricEncrypt(symmetricKey, publicKey);

    const game = {
      id: roomId,
      createdAt: Date.now(),
      createdBy: user.id,
      name: gameName,
      votingSystem,
      revealCards: false,
      votes: [],
      publicKeys: {
        [user.id]: publicKey,
      },
      encryptedSymmetricKeys: {
        [user.id]: encryptedSymmetricKey,
      },
    };

    const gameYdoc = ydoc.getMap(`game-state-${roomId}`);
    for (const [key, value] of Object.entries(game)) {
      gameYdoc.set(key, value);
    }

    const participantsYdoc = ydoc.getArray(`participants-state-${roomId}`);
    participantsYdoc.push([user]);

    const roomUrl = `${window.location.origin}/${roomId}`;
    copy(roomUrl);

    navigate(`/${roomId}`);
  };

  return (
    <div>
      <nav className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background border-border h-[56px]">
        <HeaderLeft isAuthenticated={false} />
      </nav>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onCreateGame)}
          className="max-w-[430px] w-full mx-auto px-4 py-2 mt-20"
        >
          <div className="flex flex-col justify-between h-full gap-2">
            <div className="flex flex-col gap-4">
              <FormLabel>Create Game</FormLabel>
              <FormField
                control={form.control}
                name="gameName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Game Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="votingSystem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <VotingSystemSelect field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="mt-4">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export const Component = () => {
  return <CreateGameForm />;
};
Component.displayName = "CreateGameForm";
