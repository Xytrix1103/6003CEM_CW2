import { createBrowserRouter, redirect } from 'react-router'
import { auth } from '@/firebase'
import { Discover, Filter, ForgotPassword, Home, Login, Movie, NotFound, Profile, Register, Search } from '@/pages'
import { MainLayout } from '@/layouts'
import { Spinner } from '@/components/ui'
import { ErrorBoundary, ErrorFallback } from '@/components/custom/ErrorBoundary'
import { discoverLoader, filterLoader, homeLoader, movieLoader, searchLoader, userProfileLoader } from '@/loaders'

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
				<div className="flex justify-center items-center w-full h-screen"> {/* Changed to h-screen */}
					<Spinner size="xl" variant="primary" thickness="normal" />
				</div>
			),
			errorElement: <ErrorFallback />, // Use error fallback
			loader: protectedLoader, // Add this loader
			children: [
				{
					index: true,
					loader: homeLoader,
					element: <Home />,
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
					element: <Movie />,
				},
				{
					path: '/search',
					element: <Search />,
					loader: searchLoader,
				},
				{
					path: '/filter',
					element: <Filter />,
					loader: filterLoader,
				},
				{
					path: '/public-user/:uid',
					loader: userProfileLoader,
					element: <Profile viewOnly />,
				},
				{
					path: '/profile',
					element: <Profile />,
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