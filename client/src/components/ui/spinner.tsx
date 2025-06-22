// src/components/ui/spinner.tsx
import {cn} from "@/lib";
import {forwardRef} from "react";
import {spinnerVariants} from "@/components/ui/constants";
import type {SpinnerProps} from "@/components/ui/types";

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
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


export {Spinner};