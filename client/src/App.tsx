import { RouterProvider } from 'react-router'
import router from './router'
import { ErrorBoundary } from '@/components/custom/ErrorBoundary'
import { Toaster } from '@/components/ui'

export default function App() {
	return (
		<ErrorBoundary> {/* Top-level boundary */}
			<Toaster />
			<RouterProvider router={router} />
		</ErrorBoundary>
	)
}