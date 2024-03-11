import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ComboboxDropdownMenu() {
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className={"w-6 h-6 p-0"}>
					<MoreHorizontal size={14} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
