import {Link} from 'react-router';
import {Button} from '@/components/ui';
import {AlertTriangle} from 'lucide-react';

const NotFound = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="text-center max-w-md">
				<AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4"/>
				<h1 className="text-5xl font-bold text-destructive mb-2">404</h1>
				<h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
				<p className="text-muted-foreground mb-8">
					Oops! The page you're looking for doesn't exist or has been moved.
				</p>
				<Button asChild>
					<Link to="/">Go to Homepage</Link>
				</Button>
			</div>
		</div>
	);
};

export default NotFound;