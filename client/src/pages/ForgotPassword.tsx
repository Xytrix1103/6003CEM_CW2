import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Mail } from 'lucide-react'
import {
	Alert,
	AlertDescription,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Spinner,
} from '@/components/ui'
import { auth } from '@/firebase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

// Form schema with validation
const formSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address' }),
})

const ForgotPassword = () => {
	const [isSuccess, setIsSuccess] = useState(false)
	const navigate = useNavigate()

	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await sendPasswordResetEmail(auth, values.email)
			.then(() => {
				setIsSuccess(true)
				form.reset()
				toast.success('Password reset email sent!', {
					description: 'Please check your inbox to reset your password.',
				})
			})
			.catch((error) => {
				toast.error('Failed to send reset email', {
					description: error.message || 'An unexpected error occurred',
				})
			})
	}

	const isLoading = form.formState.isSubmitting

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto bg-primary/10 p-3 rounded-full">
						<div className="bg-primary p-2 rounded-full">
							<Mail className="h-8 w-8 text-white" />
						</div>
					</div>
					<CardTitle className="text-2xl">Reset your password</CardTitle>
					<p className="text-sm text-muted-foreground">
						Enter your email to receive a password reset link
					</p>
				</CardHeader>

				<CardContent>
					{isSuccess ? (
						<div className="space-y-6 text-center">
							<Alert className="border-green-500 bg-green-50">
								<AlertDescription className="text-green-700">
									Password reset email sent! Check your inbox.
								</AlertDescription>
							</Alert>
							<div className="space-y-4">
								<Button
									onClick={() => navigate('/login')}
									className="w-full"
								>
									Return to Login
								</Button>
								<p className="text-sm text-muted-foreground">
									Didn't receive the email?{' '}
									<button
										onClick={() => setIsSuccess(false)}
										className="font-medium text-primary hover:text-primary/80"
									>
										Try again
									</button>
								</p>
							</div>
						</div>
					) : (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<div className="relative">
													<div
														className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
														<Mail className="h-4 w-4" />
													</div>
													<Input
														placeholder="you@example.com"
														autoComplete="email"
														className="pl-10"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									disabled={isLoading}
									className="w-full"
								>
									{isLoading ? (
										<div className="flex items-center justify-center">
											<Spinner className="mr-2 h-4 w-4" />
											Sending email...
										</div>
									) : (
										'Send Reset Link'
									)}
								</Button>
							</form>
						</Form>
					)}

					{!isSuccess && (
						<div className="mt-6 text-center text-sm">
							<Link
								to="/login"
								className="font-medium text-primary hover:text-primary/80 transition-colors"
							>
								Remember your password? Sign in
							</Link>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default ForgotPassword