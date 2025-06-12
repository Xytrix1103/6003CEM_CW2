import {createBrowserRouter, redirect} from "react-router";
import {auth} from "@/firebase";
import {Dashboard, Login, NotFound, Register} from "@/pages";
import {MainLayout} from "@/layouts";
import {Spinner} from "@/components/ui";

const getAuthUser = async () => {
	await auth.authStateReady();
	return auth.currentUser;
};

const protectedLoader = async () => {
	const user = await getAuthUser();
	if (!user) {
		return redirect('/login');
	}
	return null;
};

const publicLoader = async () => {
	const user = await getAuthUser();
	if (user) {
		return redirect('/');
	}
	return null;
};

const router = createBrowserRouter([
		{
			path: '/login',
			element: <Login/>,
			loader: publicLoader
		},
		{
			path: '/register',
			element: <Register/>,
			loader: publicLoader
		},
		{
			element: <MainLayout/>,
			hydrateFallbackElement: (
				<div className="flex justify-center items-center w-full h-full flex-1">
					<Spinner size="xl" variant="primary" thickness="normal"/>
				</div>
			),
			loader: protectedLoader, // Add this loader
			children: [
				{
					index: true,
					element: <Dashboard/>,
				}
			]
		},
		{
			path: '*',
			element: <NotFound/>,
		}
	]
);

export default router;