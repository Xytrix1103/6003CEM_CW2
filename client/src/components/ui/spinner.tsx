// src/components/ui/spinner.tsx
import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib";

const spinnerVariants = cva("animate-spin", {
	variants: {
		size: {
			xs: "h-3 w-3",
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
			xl: "h-8 w-8",
		},
		variant: {
			primary: "text-primary",
			secondary: "text-secondary",
			destructive: "text-destructive",
			success: "text-success",
			muted: "text-muted-foreground",
		},
		thickness: {
			thin: "stroke-[2.5]",
			normal: "stroke-[3]",
			thick: "stroke-[4]",
		}
	},
	defaultVariants: {
		size: "md",
		variant: "primary",
		thickness: "normal",
	},
});

export interface SpinnerProps
	extends React.SVGAttributes<SVGSVGElement>,
		VariantProps<typeof spinnerVariants> {
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
	({className, size, variant, thickness, ...props}, ref) => {
		return (
			<svg
				ref={ref}
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={cn(spinnerVariants({size, variant, thickness, className}))}
				{...props}
			>
				<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
			</svg>
		);
	}
);
Spinner.displayName = "Spinner";

// eslint-disable-next-line react-refresh/only-export-components
export {Spinner, spinnerVariants};