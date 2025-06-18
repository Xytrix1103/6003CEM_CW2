import { createBrowserRouter, redirect } from 'react-router'
import { auth } from '@/firebase'
import { Dashboard, Login, NotFound, Register } from '@/pages'
import { MainLayout } from '@/layouts'
import { Spinner } from '@/components/ui'
import Discover, { discoverLoader } from '@/pages/Discover'
import { homeLoader } from '@/pages/Home'
import ForgotPassword from '@/pages/ForgotPassword'
import { ErrorBoundary, ErrorFallback } from '@/components/custom/ErrorBoundary'
import MoviePage, { movieLoader } from '@/pages/Movie'

const getAuthUser = async () => {
	await auth.authStateReady()
	return auth.currentUser
}

const protectedLoader = async () => {
	const user = await getAuthUser()
	if (!user) {
		return redirect('/login')
	}
	return null
}

const publicLoader = async () => {
	const user = await getAuthUser()
	if (user) {
		return redirect('/')
	}
	return null
}

const router = createBrowserRouter([
		{
			path: '/login',
			element: <Login />,
			loader: publicLoader,
		},
		{
			path: '/register',
			element: <Register />,
			loader: publicLoader,
		},
		{
			path: '/forgot',
			element: <ForgotPassword />,
			loader: publicLoader,
		},
		{
			element: (
				<ErrorBoundary> {/* Wrap layout in error boundary */}
					<MainLayout />
				</ErrorBoundary>
			),
			hydrateFallbackElement: (
				<div className="flex justify-center items-center w-full h-full flex-1">
					<Spinner size="xl" variant="primary" thickness="normal" />
				</div>
			),
			errorElement: <ErrorFallback />, // Use error fallback
			loader: protectedLoader, // Add this loader
			children: [
				{
					index: true,
					loader: homeLoader,
					element: <Dashboard />,
				},
				{
					path: '/discover',
					loader: discoverLoader,
					element: <Discover />,
				},
				{
					path: '/movies',
					element: <div>Movies Page</div>, // Placeholder for Movies page
				},
				{
					path: '/movie/:id',
					loader: movieLoader,
					element: <MoviePage />,
				},
			],
		},
		{
			path: '*',
			element: <NotFound />,
		},
	],
)

export default router