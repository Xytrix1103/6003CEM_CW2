// src/pages/Register.tsx
import {type FormEvent, useState} from 'react';
import {Link, redirect,} from 'react-router';
import {type AuthError, createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '@/firebase';
import {AlertTriangle, Lock, Mail, User} from 'lucide-react';
import {handleFirebaseError} from '@/components/utils';
import {
	Alert,
	AlertDescription,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Spinner
} from '@/components/ui';

const Register = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			redirect('/');
		} catch (error) {
			setError(handleFirebaseError(error as AuthError));
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto bg-primary/10 p-3 rounded-full">
						<div className="bg-primary p-2 rounded-full">
							<User className="h-8 w-8 text-white"/>
						</div>
					</div>
					<CardTitle className="text-2xl">Create your account</CardTitle>
					<p className="text-sm text-muted-foreground">
						Get started with our platform
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
							<Label htmlFor="name">Full Name</Label>
							<div className="relative">
								<div
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
									<User className="h-4 w-4"/>
								</div>
								<Input
									id="name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="John Doe"
									className="pl-10"
								/>
							</div>
						</div>

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
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="pl-10"
								/>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Use 8+ characters with a mix of letters, numbers & symbols
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm Password</Label>
							<div className="relative">
								<div
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
									<Lock className="h-4 w-4"/>
								</div>
								<Input
									id="confirm-password"
									type="password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="••••••••"
									className="pl-10"
								/>
							</div>
						</div>

						<div className="mt-4">
							<Button
								type="submit"
								disabled={loading}
								className="w-full"
							>
								{loading ? (
									<div className="flex items-center justify-center">
										<Spinner className="mr-2 h-4 w-4"/>
										Creating account...
									</div>
								) : (
									'Sign up'
								)}
							</Button>
						</div>
					</form>

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
	);
};

export default Register;