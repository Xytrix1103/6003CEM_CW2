import {createContext, useContext} from "react";
import type {SidebarContextProps} from "@/components/ui/types";

export const SidebarContext = createContext<SidebarContextProps | null>(null)

export function useSidebar() {
	const context = useContext(SidebarContext)
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.")
	}

	return context
}