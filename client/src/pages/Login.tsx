// src/pages/Login.tsx
import {type FormEvent, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router';
import {type AuthError, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "@/firebase";
import {AlertTriangle, Lock, Mail} from 'lucide-react';
import {
	Alert,
	AlertDescription,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Checkbox,
	Input,
	Label,
	Spinner
} from '@/components/ui';
import {handleFirebaseError} from "@/components/utils";

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); // Add this
	const location = useLocation(); // Add this

	// Get the redirect location or default to home
	const from = location.state?.from?.pathname || '/';

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await signInWithEmailAndPassword(auth, email, password);
			// Redirect to the intended page or home
			navigate(from, {replace: true}); // Fix: use navigate instead of redirect
		} catch (error) {
			setError(handleFirebaseError(error as AuthError));
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto bg-primary/10 p-3 rounded-full">
						<div className="bg-primary p-2 rounded-full">
							<Lock className="h-8 w-8 text-white"/>
						</div>
					</div>
					<CardTitle className="text-2xl">Sign in to your account</CardTitle>
					<p className="text-sm text-muted-foreground">
						Enter your credentials to access your account
					</p>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertTriangle className="h-4 w-4"/>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<div className="relative">
								<div
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
									<Mail className="h-4 w-4"/>
								</div>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="pl-10"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<div
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
									<Lock className="h-4 w-4"/>
								</div>
								<Input
									id="password"
									type="password"
									autoComplete="current-password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="pl-10"
								/>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember-me"
									checked={rememberMe}
									onCheckedChange={(checked) => setRememberMe(checked as boolean)}
								/>
								<Label htmlFor="remember-me" className="text-sm font-medium">
									Remember me
								</Label>
							</div>
							<Link
								to="/forgot-password"
								className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
							>
								Forgot password?
							</Link>
						</div>
						<Button
							type="submit"
							disabled={loading}
							className="w-full mt-2"
							variant="outline"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<Spinner className="mr-2 h-4 w-4"/>
									Signing in...
								</div>
							) : (
								'Sign in'
							)}
						</Button>
					</form>
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
	);
};

export default Login;