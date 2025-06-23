import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from '@/components/ui'
import { NavLink, Outlet, ScrollRestoration, useNavigate } from 'react-router'
import { useContext, useState } from 'react'
import { AuthContext } from '@/components/contexts'
import { Clapperboard, Filter, Home, LogOut, MoreVertical, Search, User } from 'lucide-react'

const MainLayout = () => {
	const { logout, currentUser } = useContext(AuthContext)
	const [showLogoutDialog, setShowLogoutDialog] = useState(false)
	const navigate = useNavigate()

	const handleLogout = async () => {
		await logout()
		navigate('/login', { replace: true })
		setShowLogoutDialog(false)
	}

	return (
		<SidebarProvider defaultOpen={true} className="--sidebar-width: 250px">
			<div className="min-h-screen bg-background border-b flex flex-1">
				<div className="flex flex-1 grid-cols-[auto_1fr]">
					<Sidebar variant="sidebar" className="bg-sidebar border-r w-[250px]">
						<SidebarContent className="flex flex-1">
							<SidebarHeader className="p-4 border-b">
								<div className="flex items-center gap-3">
									<Clapperboard className="h-6 w-6 text-primary" />
									<h1 className="text-lg font-semibold">MovieHub</h1>
								</div>
							</SidebarHeader>

							<div className="flex-1 overflow-y-auto py-4">
								<SidebarGroup>
									<SidebarMenu>
										<SidebarMenuItem>
											<NavLink to="/"
													 className={({ isActive }) => isActive ? 'text-primary' : ''}>
												<SidebarMenuButton className="gap-3 w-full">
													<Home className="h-4 w-4" />
													<span>Dashboard</span>
												</SidebarMenuButton>
											</NavLink>
										</SidebarMenuItem>

										{/* Discover */}
										<SidebarMenuItem>
											<NavLink to="/discover"
													 className={({ isActive }) => isActive ? 'text-primary' : ''}>
												<SidebarMenuButton className="gap-3 w-full">
													<Clapperboard className="h-4 w-4" />
													<span>Discover Movies</span>
												</SidebarMenuButton>
											</NavLink>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<NavLink to="/filter"
													 className={({ isActive }) => isActive ? 'text-primary' : ''}>
												<SidebarMenuButton className="gap-3 w-full">
													<Filter className="h-4 w-4" />
													<span>Filter Movies</span>
												</SidebarMenuButton>
											</NavLink>
										</SidebarMenuItem>

										<SidebarMenuItem>
											<NavLink to="/search"
													 className={({ isActive }) => isActive ? 'text-primary' : ''}>
												<SidebarMenuButton className="gap-3 w-full">
													<Search className="h-4 w-4" />
													<span>Search Movies</span>
												</SidebarMenuButton>
											</NavLink>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroup>
							</div>

							<SidebarFooter className="p-4 border-t">
								<div className="flex flex-col gap-3">
									{/* User info with profile icon and menu */}
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<div className="flex-shrink-0 bg-accent p-2 rounded-full">
												<User className="h-4 w-4" />
											</div>

											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">
													{currentUser?.displayName || 'Guest'}
												</p>
											</div>
										</div>

										{/* Triple dot menu */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent align="end" className="w-48">
												<DropdownMenuItem asChild>
													<NavLink
														to="/profile"
														className="flex items-center gap-2 w-full cursor-pointer"
													>
														<User className="h-4 w-4" />
														<span>Profile</span>
													</NavLink>
												</DropdownMenuItem>

												<DropdownMenuItem
													className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
													onSelect={() => setShowLogoutDialog(true)}
												>
													<LogOut className="h-4 w-4 text-destructive" />
													<span>Logout</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</SidebarFooter>
						</SidebarContent>
					</Sidebar>

					{/* Main Content Area */}
					<SidebarInset className="!m-0">
						<main className="bg-background p-6 md:p-8 lg:p-10 overflow-x-hidden flex-1 min-h-0 min-w-0">
							<ScrollRestoration />
							<div className="flex-1 min-w-0 flex flex-col">
								<Outlet />
							</div>
						</main>
					</SidebarInset>
				</div>
			</div>

			{/* Logout Confirmation Dialog */}
			<AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Logout</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to logout? You'll need to sign back in to access your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleLogout}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Logout
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SidebarProvider>
	)
}

export default MainLayout