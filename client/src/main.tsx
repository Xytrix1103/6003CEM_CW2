import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@/components/providers'
import { StrictMode } from 'react'
import { ThemeProvider } from '@/components/themes/theme-provider'
import './styles/globals.css'
import { ErrorBoundary } from '@/components/custom/ErrorBoundary'
import { ProfileProvider } from '@/components/providers/ProfileProvider'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<AuthProvider>
				<ProfileProvider>
					<ErrorBoundary> {/* Wrap App with boundary */}
						<App />
					</ErrorBoundary>
				</ProfileProvider>
			</AuthProvider>
		</ThemeProvider>
	</StrictMode>,
)