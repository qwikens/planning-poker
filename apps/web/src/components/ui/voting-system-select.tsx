import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

export const VotingSystemSelect = <
  TFields extends FieldValues,
  TName extends Path<TFields>,
>({
  field,
}: {
  field: ControllerRenderProps<TFields, TName>;
}) => {
  return (
    <Select {...field}>
      <SelectTrigger>
        <SelectValue placeholder="Voting System" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fibonacci">
          Fibonacci (0,1,2,3,5,8,13,21,34,?,☕)
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
