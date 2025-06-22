import type {User} from 'firebase/auth';

export type AuthContextType = {
	currentUser: User | null;
	loading: boolean;
	logout: () => Promise<void>;
}