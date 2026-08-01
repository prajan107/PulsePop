import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#6366F1]/15 text-[#818CF8] hover:bg-[#6366F1]/25",
        secondary:
          "border-transparent bg-[#1F2937] text-[#94A3B8] hover:bg-[#374151]",
        success:
          "border-transparent bg-[#10B981]/15 text-[#34D399] hover:bg-[#10B981]/25",
        danger:
          "border-transparent bg-[#EF4444]/15 text-[#F87171] hover:bg-[#EF4444]/25",
        outline: "text-[#F8FAFC] border-[#1F2937]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
