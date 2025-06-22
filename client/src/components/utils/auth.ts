import {type AuthError} from 'firebase/auth';

export function handleFirebaseError(error: AuthError): string {
	switch (error.code) {
		case 'auth/invalid-email':
			return 'Invalid email format';
		case 'auth/user-disabled':
			return 'Account disabled';
		case 'auth/user-not-found':
			return 'No account found with this email';
		case 'auth/wrong-password':
			return 'Incorrect password';
		case 'auth/too-many-requests':
			return 'Too many attempts. Try again later';
		case 'auth/email-already-in-use':
			return 'Email already in use';
		case 'auth/operation-not-allowed':
			return 'Operation not allowed';
		case 'auth/weak-password':
			return 'Password is too weak';
		default:
			return 'An error occurred. Please try again';
	}
}