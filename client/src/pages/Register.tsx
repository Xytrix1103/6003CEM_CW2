// src/pages/Register.tsx
import { Link, useNavigate } from 'react-router'
import { type AuthError, signInWithCustomToken } from 'firebase/auth'
import { Lock, Mail, User } from 'lucide-react'
import {
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
import { post } from '@/api'
import { auth } from '@/firebase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

// Define form schema with validation
const formSchema = z.object({
	name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string()
		.min(8, { message: 'Password must be at least 8 characters' })
		.regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
		.regex(/[0-9]/, { message: 'Password must contain at least one number' })
		.regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one symbol' }),
	confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
})

const Register = () => {
	const navigate = useNavigate()

	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		return await post<{ token: string }>('/auth/register', {
			email: values.email,
			password: values.password,
			displayName: values.name,
		})
			.then(async (data) => {
				return await signInWithCustomToken(auth, data.token)
			})
			.then(() => {
				navigate('/', { replace: true })
			})
			.catch((err: AuthError) => {
				toast.error('Login failed', {
					description: err.message,
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
							<User className="h-8 w-8 text-white" />
						</div>
					</div>
					<CardTitle className="text-2xl">Create your account</CardTitle>
					<p className="text-sm text-muted-foreground">
						Get started with our platform
					</p>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{/* Name Field */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<div className="relative">
												<div
													className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
													<User className="h-4 w-4" />
												</div>
												<Input
													placeholder="John Doe"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email Field */}
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

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<div
													className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
													<Lock className="h-4 w-4" />
												</div>
												<Input
													type="password"
													placeholder="••••••••"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
										<p className="text-xs text-muted-foreground mt-1">
											Use 8+ characters with a mix of letters, numbers & symbols
										</p>
									</FormItem>
								)}
							/>

							{/* Confirm Password Field */}
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<div className="relative">
												<div
													className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
													<Lock className="h-4 w-4" />
												</div>
												<Input
													type="password"
													placeholder="••••••••"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="mt-4">
								<Button
									type="submit"
									disabled={isLoading}
									className="w-full"
								>
									{isLoading ? (
										<div className="flex items-center justify-center">
											<Spinner className="mr-2 h-4 w-4" />
											Creating account...
										</div>
									) : (
										'Sign up'
									)}
								</Button>
							</div>
						</form>
					</Form>

					<div className="mt-6 text-center text-sm">
						<div className="text-muted-foreground">
							Already have an account?{' '}
						</div>
						<Link
							to="/login"
							className="font-medium text-primary hover:text-primary/80 transition-colors"
						>
							Sign in
						</Link>
					</div>

					<div className="mt-6 border-t pt-6">
						<p className="text-xs text-muted-foreground text-center px-6">
							By signing up, you agree to our Terms of Service and Privacy Policy.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Register