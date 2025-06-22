// src/components/error/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	}

	public static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
		}
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo)
	}

	public resetError = () => {
		this.setState({ hasError: false, error: null })
	}

	public render() {
		if (this.state.hasError) {
			return this.props.fallback || <ErrorFallback error={this.state.error} onReset={this.resetError} />
		}

		return this.props.children
	}
}

// Error Fallback Component
interface ErrorFallbackProps {
	error?: Error | null
	onReset?: () => void
}

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
			<div className="text-center max-w-md">
				<div
					className="mx-auto bg-destructive/10 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-6">
					<AlertTriangle className="h-12 w-12 text-destructive" />
				</div>

				<h1 className="text-3xl font-bold text-foreground mb-2">
					Something went wrong
				</h1>

				<p className="text-muted-foreground mb-6">
					We're sorry for the inconvenience. Please try reloading the page or
					return to the homepage.
				</p>

				{error && (
					<details className="mb-6 text-left bg-muted/50 p-4 rounded-lg text-sm overflow-auto max-h-40">
						<summary className="font-medium cursor-pointer mb-2">
							Error details
						</summary>
						<code className="text-destructive block whitespace-pre-wrap break-words">
							{error.toString()}
						</code>
					</details>
				)}

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Button
						onClick={onReset}
						variant="outline"
						className="px-6 py-3"
					>
						Try Again
					</Button>

					<Button asChild className="px-6 py-3">
						<Link to="/">Go to Homepage</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}

export { ErrorBoundary, ErrorFallback }