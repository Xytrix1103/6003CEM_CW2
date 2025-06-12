import type {SVGAttributes} from "react";
import type {VariantProps} from "class-variance-authority";
import type {spinnerVariants} from "@/components/ui/constants.ts";

export type SidebarContextProps = {
	state: "expanded" | "collapsed"
	open: boolean
	setOpen: (open: boolean) => void
	openMobile: boolean
	setOpenMobile: (open: boolean) => void
	isMobile: boolean
	toggleSidebar: () => void
}

export interface SpinnerProps
	extends SVGAttributes<SVGSVGElement>,
		VariantProps<typeof spinnerVariants> {
}