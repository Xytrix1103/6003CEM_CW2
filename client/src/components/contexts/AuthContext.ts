import {createContext} from 'react';
import type {AuthContextType} from "@/types";

export const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	loading: true,
	logout: async () => void 0,
});