// src/contexts/ProfileContext.tsx
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import type { Profile } from '@/types/profile'
import { auth } from '@/firebase'
import { ProfileContext } from '../contexts'
import { del, get, patch, post, put } from '@/api'
import { toast } from 'sonner'

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profile, setProfile] = useState<Profile | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchProfile = useCallback(async () => {
		setLoading(true)
		return await get<Profile>('/user/')
			.then(data => {
				setProfile(data)
			})
			.catch(() => {
				setProfile(null)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const refreshProfile = useCallback(async () => {
		return await auth.authStateReady()
			.then(() => {
				const user = auth.currentUser
				return user ? fetchProfile() : Promise.resolve()
			})
			.then(() => {
				if (!auth.currentUser) {
					setProfile(null)
					setLoading(false)
				}
			})
	}, [fetchProfile])

	const updateDisplayName = useCallback(async (displayName: string) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await patch('/user/name', { displayName })
					.then(async (data) => {
						return await auth.updateCurrentUser({
							...user,
							displayName: displayName,
						})
							.then(() => {
								toast.success('Success', {
									description: data.message || 'Display name updated successfully',
								})
							})
							.catch(error => {
								return Promise.reject(error)
							})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => {
				return fetchProfile()
			})
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [fetchProfile])

	// Add to watchlist
	const addToWatchlist = useCallback(async (movieId: number) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await post('/user/watchlist', { movieId })
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Movie added to watchlist successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Remove from watchlist
	const removeFromWatchlist = useCallback(async (movieId: number) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await del(`/user/watchlist/${movieId}`)
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Movie removed from watchlist successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Favorite a movie
	const favoriteMovie = useCallback(async (movieId: number) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await post('/user/favorites', { movieId })
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Movie favorited successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Unfavorite a movie
	const unfavoriteMovie = useCallback(async (movieId: number) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await del(`/user/favorites/${movieId}`)
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Movie unfavorited successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Add review
	const addReview = useCallback(async (movieId: number, rating: number | null, content: string | null) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await post('/user/feedback', {
					movieId,
					rating: rating,
					content: content,
				})
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Review added successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Update review
	const updateReview = useCallback(async (movieId: number, rating: number | null, content: string | null) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await put(`/user/feedback/${movieId}`, {
					rating: rating,
					content: content,
				})
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Review updated successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Delete review
	const deleteReview = useCallback(async (movieId: number) => {
		return await auth.authStateReady()
			.then(async () => {
				const user = auth.currentUser
				if (!user) return Promise.reject({ message: 'User not authenticated' })

				return await del(`/user/feedback/${movieId}`)
					.then((data) => {
						toast.success('Success', {
							description: data.message || 'Review deleted successfully',
						})
					})
					.catch(error => {
						return Promise.reject(error)
					})
			})
			.then(() => refreshProfile())
			.catch(error => {
				toast.error('Something went wrong', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}, [refreshProfile])

	// Initial load and auth state change
	useEffect(() => {
		return auth.onAuthStateChanged(user => {
			if (user) {
				refreshProfile()
					.catch(error => {
						console.error('Failed to refresh profile on auth change', error)
					})
			} else {
				setProfile(null)
				setLoading(false)
			}
		})
	}, [refreshProfile])

	const contextValue = {
		profile,
		loading,
		refreshProfile,
		updateDisplayName,
		addToWatchlist,
		removeFromWatchlist,
		favoriteMovie,
		unfavoriteMovie,
		addReview,
		updateReview,
		deleteReview,
	}

	return (
		<ProfileContext.Provider value={contextValue}>
			{children}
		</ProfileContext.Provider>
	)
}