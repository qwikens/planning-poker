import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const PokerPlanningSelect = ({
	defaultValue,
}: {
	defaultValue?: string;
} = {}) => {
	return (
		<Select name="votingSystem" defaultValue={defaultValue ?? "fibonacci"}>
			<SelectTrigger>
				<SelectValue placeholder="Voting System" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="fibonacci">
					Fibonacci (0,1,2,3,5,8,13,21,34)
				</SelectItem>
			</SelectContent>
		</Select>
	);
};
