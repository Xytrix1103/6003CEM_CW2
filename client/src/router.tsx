import {createBrowserRouter, redirect} from "react-router";
import {auth} from "@/firebase";
import {Login, NotFound, Register} from "@/pages";
import {MainLayout} from "@/layouts";
import {Spinner} from "@/components/ui";

const authLoader = async () => {
	await auth.authStateReady();
	return auth.currentUser;
};

const router = createBrowserRouter([
		{
			path: '/login',
			element: <Login/>,
			loader: async () => {
				const user = await authLoader();
				return user ? redirect('/') : null;
			}
		},
		{
			path: '/register',
			element: <Register/>,
			loader: async () => {
				const user = await authLoader();
				return user ? redirect('/') : null;
			}
		},
		{
			element: <MainLayout/>,
			hydrateFallbackElement: (
				<div className="flex justify-center items-center w-full h-full flex-1">
					<Spinner size="xl" variant="primary" thickness="normal"/>
				</div>
			),
			loader: async () => {
				const user = await authLoader();
				return user ? null : redirect('/login');
			},
			children: [
				{
					index: true,
					element: (
						<div className="home">
							<h1>Welcome to the Dashboard</h1>
						</div>
					)
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