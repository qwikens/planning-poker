import { cn } from "@/lib/utils.ts";
import * as React from "react";

type KbdElement = React.ElementRef<"kbd">;
interface KbdProps extends React.ComponentPropsWithoutRef<"kbd"> {}
const Kbd = React.forwardRef<KbdElement, KbdProps>((props, forwardedRef) => {
  return (
    <kbd
      {...props}
      ref={forwardedRef}
      className={cn(
        "inline-block p-1 text-center text-foreground/80 capitalize align-baseline bg-secondary border-[0.5px] border-foreground/10 shadow shadow-sm cursor-default  select-none font-style-normal whitespace-nowrap leading-[110%] text-[11px]  rounded-sm min-w-[20px]",
        props.className,
      )}
    />
  );
});
Kbd.displayName = "Kbd";

export { Kbd };
export type { KbdProps };
