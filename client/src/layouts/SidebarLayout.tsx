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
} from '@/components/ui'
import { NavLink } from 'react-router-dom'
import { Clapperboard, Film, Home, LogOut, Popcorn, Search, Settings, Star, User } from 'lucide-react'
import type { User as FirebaseUser } from 'firebase/auth'

interface SidebarLayoutProps {
	currentUser: FirebaseUser | null;
	handleLogout: () => void;
}

const SidebarLayout = ({ currentUser, handleLogout }: SidebarLayoutProps) => {
	return (
		<SidebarProvider defaultOpen={true}>
			<div className="h-full flex-shrink-0">
				<Sidebar variant="sidebar" className="bg-sidebar border-r h-full">
					<SidebarContent className="flex flex-col h-full">
						<SidebarHeader className="p-4 border-b">
							<div className="flex items-center gap-3">
								<Clapperboard className="h-6 w-6 text-primary" />
								<h1 className="text-lg font-semibold">MovieHub6003</h1>
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

									<SidebarMenuItem>
										<NavLink to="/movies"
												 className={({ isActive }) => isActive ? 'text-primary' : ''}>
											<SidebarMenuButton className="gap-3 w-full">
												<Film className="h-4 w-4" />
												<span>Movies</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<NavLink to="/genres"
												 className={({ isActive }) => isActive ? 'text-primary' : ''}>
											<SidebarMenuButton className="gap-3 w-full">
												<Popcorn className="h-4 w-4" />
												<span>Genres</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<NavLink to="/discover"
												 className={({ isActive }) => isActive ? 'text-primary' : ''}>
											<SidebarMenuButton className="gap-3 w-full">
												<Search className="h-4 w-4" />
												<span>Discover</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<NavLink to="/favorites"
												 className={({ isActive }) => isActive ? 'text-primary' : ''}>
											<SidebarMenuButton className="gap-3 w-full">
												<Star className="h-4 w-4" />
												<span>Favorites</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroup>

							<SidebarGroup>
								<h3 className="text-xs font-medium text-muted-foreground uppercase py-2">
									Account
								</h3>

								<SidebarMenu>
									<SidebarMenuItem>
										<NavLink to="/profile"
												 className={({ isActive }) => isActive ? 'text-primary' : ''}>
											<SidebarMenuButton className="gap-3 w-full">
												<User className="h-4 w-4" />
												<span>Profile</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>

									<SidebarMenuItem>
										<NavLink to="/settings"
												 className={({ isActive }) => isActive ? 'text-primary' : ''}>
											<SidebarMenuButton className="gap-3 w-full">
												<Settings className="h-4 w-4" />
												<span>Settings</span>
											</SidebarMenuButton>
										</NavLink>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroup>
						</div>

						<SidebarFooter className="p-4 border-t">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-3">
									<div className="bg-accent p-2 rounded-full">
										<User className="h-5 w-5" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{currentUser?.email || 'Guest'}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											Premium Member
										</p>
									</div>
								</div>

								<Button
									variant="outline"
									onClick={handleLogout}
									className="mt-2 gap-2 w-full"
								>
									<LogOut className="h-4 w-4" />
									<span>Logout</span>
								</Button>
							</div>
						</SidebarFooter>
					</SidebarContent>
				</Sidebar>
			</div>
		</SidebarProvider>
	)
}

export default SidebarLayout