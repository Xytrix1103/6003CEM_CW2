import { createContext } from 'react'
import type { ProfileContextType } from '@/types/profile'

export const ProfileContext = createContext<ProfileContextType>({
	profile: null,
	loading: false,
	updateDisplayName: async () => {
		throw new Error('Function not implemented.')
	},
	refreshProfile: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	addToWatchlist: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	removeFromWatchlist: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	favoriteMovie: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	unfavoriteMovie: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	addReview: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	updateReview: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
	deleteReview: function(): Promise<void> {
		throw new Error('Function not implemented.')
	},
})