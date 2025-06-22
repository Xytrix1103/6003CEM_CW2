import { Link, useLocation, useNavigate } from 'react-router'
import { type AuthError, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { Lock, Mail } from 'lucide-react'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Spinner,
} from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

// Define form schema
const formSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string(),
	rememberMe: z.boolean().optional(),
})

const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const from = location.state?.from?.pathname || '/'

	// Initialize form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await signInWithEmailAndPassword(auth, values.email, values.password)
			.then(() => {
				navigate(from, { replace: true })
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
							<Lock className="h-8 w-8 text-white" />
						</div>
					</div>
					<CardTitle className="text-2xl">Sign in to your account</CardTitle>
					<p className="text-sm text-muted-foreground">
						Enter your credentials to access your account
					</p>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
													autoComplete="current-password"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center justify-between">
								{/* Remember Me */}
								<FormField
									control={form.control}
									name="rememberMe"
									render={({ field }) => (
										<FormItem className="flex items-center space-x-2">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormLabel className="text-sm font-medium !mt-0">
												Remember me
											</FormLabel>
										</FormItem>
									)}
								/>

								<Link
									to="/forgot"
									className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full mt-2"
								variant="outline"
							>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<Spinner className="mr-2 h-4 w-4" />
										Signing in...
									</div>
								) : (
									'Sign in'
								)}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center text-sm">
						<div className="text-muted-foreground">Don't have an account?</div>
						<Link
							to="/register"
							className="font-medium text-primary hover:text-primary/80 transition-colors"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default Login