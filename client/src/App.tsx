import { RouterProvider } from 'react-router'
import router from './router'
import { ErrorBoundary } from '@/components/custom/ErrorBoundary'

export default function App() {
	return (
		<ErrorBoundary> {/* Top-level boundary */}
			<RouterProvider router={router} />
		</ErrorBoundary>
	)
}