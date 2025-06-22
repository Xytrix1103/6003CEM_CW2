import { type ReactNode, useEffect, useState } from 'react'
import { auth } from '@/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { AuthContext } from '@/components/contexts'

export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribeFirebase = onAuthStateChanged(auth, async (user) => {
			console.log('Auth state changed:', user)
			setCurrentUser(user)

			setLoading(false)
		})

		return () => {
			unsubscribeFirebase()
		}
	}, [])

	const logout = async () => {
		await auth.signOut()
	}

	return (
		<AuthContext.Provider value={{ currentUser, loading, logout }}>
			{!loading && children}
		</AuthContext.Provider>
	)
}