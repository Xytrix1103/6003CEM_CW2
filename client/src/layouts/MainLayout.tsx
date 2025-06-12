import {
	Button,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger
} from '@/components/ui';
import {NavLink, Outlet, ScrollRestoration, useNavigate} from "react-router";
import {useContext, useState} from "react";
import {AuthContext} from "@/components/contexts";
import {Clapperboard, Film, Home, LogOut, Menu, Popcorn, Search, Settings, Star, User} from 'lucide-react';

const MainLayout = () => {
	const {logout, currentUser} = useContext(AuthContext);
	const navigate = useNavigate();
	const [activePath, setActivePath] = useState(window.location.pathname);

	const handleLogout = async () => {
		await logout();
		navigate('/login', {replace: true});
	};

	const handleNavigation = (path: string) => {
		setActivePath(path);
		navigate(path);
	};

	return (
		<SidebarProvider defaultOpen={true}>
			<div className="min-h-screen flex flex-col bg-background">
				<ScrollRestoration/>

				{/* Header */}
				<header className="bg-background border-b sticky top-0 z-10">
					<nav className="container mx-auto px-4 py-3 flex justify-between items-center">
						<div className="flex items-center gap-4">
							<SidebarTrigger className="md:hidden">
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5"/>
								</Button>
							</SidebarTrigger>

							<NavLink to="/" className="flex items-center gap-2">
								<Clapperboard className="h-7 w-7 text-primary"/>
								<span className="text-xl font-bold hidden sm:inline">MovieHub6003</span>
							</NavLink>
						</div>

						<div className="flex items-center gap-4">
							<div className="hidden md:flex items-center gap-2">
								<User className="h-5 w-5 text-muted-foreground"/>
								<span className="text-sm">{currentUser?.email || 'Guest'}</span>
							</div>

							<Button
								variant="outline"
								onClick={handleLogout}
								className="flex items-center gap-2"
							>
								<LogOut className="h-4 w-4"/>
								<span className="hidden sm:inline">Logout</span>
							</Button>
						</div>
					</nav>
				</header>

				<div className="flex flex-1">
					{/* Sidebar */}
					<Sidebar variant="inset" className="bg-background border-r">
						<SidebarContent>
							<SidebarHeader className="p-4 border-b">
								<div className="flex items-center gap-3">
									<Clapperboard className="h-6 w-6 text-primary"/>
									<h2 className="text-lg font-semibold">MovieHub6003</h2>
								</div>
							</SidebarHeader>

							<div className="flex-1 overflow-y-auto">
								<SidebarGroup>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath === '/'}
												onClick={() => handleNavigation('/')}
												className="gap-3"
											>
												<Home className="h-4 w-4"/>
												<span>Dashboard</span>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath.includes('/movies')}
												onClick={() => handleNavigation('/movies')}
												className="gap-3"
											>
												<Film className="h-4 w-4"/>
												<span>Movies</span>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath.includes('/genres')}
												onClick={() => handleNavigation('/genres')}
												className="gap-3"
											>
												<Popcorn className="h-4 w-4"/>
												<span>Genres</span>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath.includes('/discover')}
												onClick={() => handleNavigation('/discover')}
												className="gap-3"
											>
												<Search className="h-4 w-4"/>
												<span>Discover</span>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath.includes('/favorites')}
												onClick={() => handleNavigation('/favorites')}
												className="gap-3"
											>
												<Star className="h-4 w-4"/>
												<span>Favorites</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroup>

								<SidebarGroup>
									<h3 className="text-xs font-medium text-muted-foreground uppercase px-4 py-2">
										Account
									</h3>

									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath.includes('/profile')}
												onClick={() => handleNavigation('/profile')}
												className="gap-3"
											>
												<User className="h-4 w-4"/>
												<span>Profile</span>
											</SidebarMenuButton>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<SidebarMenuButton
												isActive={activePath.includes('/settings')}
												onClick={() => handleNavigation('/settings')}
												className="gap-3"
											>
												<Settings className="h-4 w-4"/>
												<span>Settings</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroup>
							</div>

							<SidebarFooter className="p-4 border-t">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<User className="h-5 w-5 text-muted-foreground"/>
										<span className="text-sm truncate max-w-[120px]">
                      {currentUser?.email || 'Guest'}
                    </span>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleLogout}
										title="Logout"
									>
										<LogOut className="h-4 w-4"/>
									</Button>
								</div>
							</SidebarFooter>
						</SidebarContent>
					</Sidebar>

					{/* Main Content */}
					<main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
						<div className="max-w-7xl mx-auto w-full">
							<Outlet/>
						</div>
					</main>
				</div>

				{/* Footer */}
				<footer className="bg-background border-t py-4">
					<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
						© {new Date().getFullYear()} MovieHub6003. All rights reserved.
					</div>
				</footer>
			</div>
		</SidebarProvider>
	);
};

export default MainLayout;