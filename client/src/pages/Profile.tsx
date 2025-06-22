// src/pages/Profile.tsx
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { sendPasswordResetEmail } from 'firebase/auth'
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form as ShadcnForm,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Separator,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui'
import { AuthContext, ProfileContext } from '@/components/contexts'
import MovieCard from '@/components/custom/MovieCard'
import { Bookmark, Copy, Heart, Lock, MessageCircle, Pencil, Star, Trash2, User } from 'lucide-react'
import type { Profile, Watched } from '@/types/profile'
import { auth } from '@/firebase'
import { cn } from '@/lib/utils'
import type { MovieDetailsResponse } from '@/types/movie'
import { toast } from 'sonner'
import { useLoaderData } from 'react-router'

// Validation schemas
const displayNameSchema = z.object({
	displayName: z.string().min(2, 'Display name must be at least 2 characters'),
})

const reviewSchema = z.object({
	rating: z
		.number()
		.min(1, 'Please select a rating')
		.max(5, 'Rating must be between 1-5'),
	content: z
		.string()
		.max(1000, 'Review cannot exceed 1000 characters')
		.optional(),
})

// Review Card Component
interface ReviewCardProps {
	review: Watched;
	movie: MovieDetailsResponse;
	onEdit: () => void;
	onDelete: () => void;
	viewOnly?: boolean;
}

const ReviewCard = ({ review, movie, onEdit, onDelete, viewOnly = false }: ReviewCardProps) => {
	const [showDeleteReviewDialog, setShowDeleteReviewDialog] = useState(false)

	const handleDelete = () => {
		onDelete()
		setShowDeleteReviewDialog(false)
	}

	return (
		<div className="border rounded-lg p-4 flex gap-4 bg-muted mb-4"> {/* Added mb-4 */}
			<AlertDialog open={showDeleteReviewDialog} onOpenChange={setShowDeleteReviewDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove from Watchlist?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove "{movie.title}" from your watchlist?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className="flex-shrink-0">
				{movie.poster_path ? (
					<img
						src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
						alt={movie.title}
						className="w-16 rounded-lg"
					/>
				) : (
					<div
						className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-24 flex items-center justify-center">
						<div className="bg-gray-300 w-full h-full flex items-center justify-center">
							<MessageCircle className="h-8 w-8 text-gray-400" />
						</div>
					</div>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<h3 className="font-bold text-lg">{movie.title}</h3>

				<div className="flex items-center gap-2 mt-1">
					<div className="flex">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-5 w-5 ${i < (review.feedback.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
							/>
						))}
					</div>
					<div className="text-sm text-muted-foreground">
						{review.feedback.rating?.toFixed(1) || 'N/A'}
					</div>
				</div>

				{review.feedback.content && (
					<p className="mt-2 text-sm">
						{review.feedback.content}
					</p>
				)}

				<div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
					<div>
						Reviewed on {new Date(review.feedback.updatedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					})}
					</div>
				</div>
			</div>
			{
				!viewOnly &&
				<div className="flex gap-2 self-start">
					<Button variant="outline" size="icon" onClick={onEdit}>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button variant="destructive" size="icon" onClick={() => setShowDeleteReviewDialog(true)}>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			}
		</div>
	)
}

export default function ProfilePage({ viewOnly = false }: { viewOnly?: boolean }) {
	const { currentUser } = useContext(AuthContext)
	const {
		profile: currentUserProfile,
		updateDisplayName,
		updateReview,
		deleteReview,
	} = useContext(ProfileContext)
	const loaderData = useLoaderData() as Profile
	const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
	const [isDisplayNameDialogOpen, setIsDisplayNameDialogOpen] = useState(false)
	const [isEditReviewOpen, setIsEditReviewOpen] = useState(false)
	const [currentReviewMovie, setCurrentReviewMovie] = useState<Watched | null>(null)
	const [activeTab, setActiveTab] = useState('watchlist')
	const profile = !viewOnly ? currentUserProfile : loaderData

	// Forms
	const displayNameForm = useForm<z.infer<typeof displayNameSchema>>({
		resolver: zodResolver(displayNameSchema),
		defaultValues: {
			displayName: profile?.displayName || '',
		},
	})

	const reviewForm = useForm<z.infer<typeof reviewSchema>>({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			rating: 0,
			content: '',
		},
	})

	// Open review edit dialog
	const openEditReview = (watched: Watched) => {
		setCurrentReviewMovie(watched)
		reviewForm.reset({
			rating: watched.feedback.rating || 0,
			content: watched.feedback.content || '',
		})
		setIsEditReviewOpen(true)
	}

	// Handle display name update
	const handleUpdateDisplayName = async (values: z.infer<typeof displayNameSchema>) => {
		await updateDisplayName(values.displayName)
			.then(() => {
				toast.success('Display Name Updated', {
					description: 'Your display name has been successfully updated',
				})
				setIsDisplayNameDialogOpen(false)
			})
	}

	// Handle password reset
	const handlePasswordReset = async () => {
		if (!currentUser?.email) return

		await sendPasswordResetEmail(auth, currentUser.email)
			.then(() => {
				toast.success('Password Reset Email Sent', {
					description: 'Check your email for instructions to reset your password',
				})
				setIsPasswordDialogOpen(false)
			})
	}

	// Handle review submission
	const handleReviewSubmit = async (values: z.infer<typeof reviewSchema>) => {
		if (!currentReviewMovie || !currentUser) return

		const text = values.content?.trim() || null

		await updateReview(currentReviewMovie.movieId, values.rating, text)
			.then(() => {
				setIsEditReviewOpen(false)
				toast.success('Review Updated', {
					description: 'Your review has been updated successfully',
				})
			})
	}

	// Handle review deletion
	const handleDeleteReview = async () => {
		if (!currentReviewMovie || !currentUser) return

		await deleteReview(currentReviewMovie.movieId)
			.then(() => {
				setIsEditReviewOpen(false)
				toast.success('Review Deleted', {
					description: 'Your review has been removed',
				})
			})
	}

	// Render movie cards for profile sections
	const renderMovieCards = (movies: MovieDetailsResponse[]) => {
		if (!movies.length) {
			return (
				<div className="col-div-full text-center py-8 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
					<p className="text-muted-foreground">
						{activeTab === 'watchlist'
							? 'Your watchlist is empty'
							: 'You haven\'t added any favorites yet'}
					</p>
				</div>
			)
		}

		return movies.map(movie => (
			<MovieCard key={movie.id} movie={movie} viewOnly={viewOnly} />
		))
	}

	// Get movies with reviews
	const getMoviesWithReviews = () => {
		if (!profile || !profile.watched || !profile.movies) return []

		return profile.watched
			.filter(w => w.feedback.rating !== null || w.feedback.content !== null)
			.map(w => {
				const movie = profile.movies?.find(m => m.id === w.movieId) as MovieDetailsResponse
				return { review: w, movie }
			})
			.filter(item => item.movie) // Only include if movie exists
			.filter(Boolean)
	}

	// Get favorite movies
	const getFavoriteMovies = () => {
		if (!profile || !profile.watched || !profile.movies) return []

		const favoriteMovieIds = profile.watched
			.filter(w => w.isFavorited)
			.map(w => w.movieId)

		return profile.movies.filter(m => favoriteMovieIds.includes(m.id))
	}

	return (
		<TooltipProvider>
			<div className="container py-8">
				{/* Profile Header */}
				<div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
					<div className="bg-gradient-to-br from-primary to-secondary rounded-full p-1">
						<div className="bg-background rounded-full p-1">
							<div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
								<User className="h-12 w-12 text-primary" />
							</div>
						</div>
					</div>

					<div className="flex-1 flex flex-col gap-3">
						<div className="flex items-center gap-4">
							<h1 className="text-3xl font-bold">
								{profile?.displayName || currentUser?.displayName || 'My Profile'}{' '}
								{viewOnly && currentUserProfile?._id === profile?._id &&
									'(Me)'
								}
							</h1>
							{!viewOnly && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											onClick={() => setIsDisplayNameDialogOpen(true)}
										>
											<Pencil className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Click to edit your display name</p>
									</TooltipContent>
								</Tooltip>
							)}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={async () => {
											await navigator.clipboard.writeText(
												`${window.location.origin}/public-user/${profile?._id}`,
											)
											toast.success('Profile link copied to clipboard')
										}}
									>
										<Copy className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									Copy public profile link
								</TooltipContent>
							</Tooltip>
							{
								!viewOnly && (
									<div className="flex flex-wrap gap-2">
										<Button
											variant="secondary"
											onClick={() => setIsPasswordDialogOpen(true)}
										>
											<Lock className="h-4 w-4 mr-2" />
											Change Password
										</Button>
									</div>
								)
							}
						</div>
						<p className="text-muted-foreground">
							{currentUser?.email}{' '}
							{currentUserProfile?.createdAt &&
								`(Member since ${new Date(currentUserProfile.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								})})`
							}
						</p>
						{
							!viewOnly && (
								<div className="text-sm text-muted-foreground">
									Visited {profile?.visits?.length || 0} time
									{profile?.visits?.length !== 1 ? 's' : ''} by other users
								</div>
							)
						}
					</div>
				</div>

				<Separator className="my-6" />

				{/* Content Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="watchlist">
							<Bookmark className="h-4 w-4 mr-2" />
							Watchlist
						</TabsTrigger>
						<TabsTrigger value="favorites">
							<Heart className="h-4 w-4 mr-2" />
							Favorites
						</TabsTrigger>
						<TabsTrigger value="reviews">
							<MessageCircle className="h-4 w-4 mr-2" />
							Reviews
						</TabsTrigger>
						<TabsTrigger value="watched">
							<User className="h-4 w-4 mr-2" />
							Watched
						</TabsTrigger>
					</TabsList>

					{/* Watchlist Content */}
					<TabsContent value="watchlist" className="py-6">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{renderMovieCards(profile?.movies?.filter(movie =>
								profile?.watchlist?.includes(movie.id),
							) || [])}
						</div>
					</TabsContent>

					{/* Favorites Content */}
					<TabsContent value="favorites" className="py-6">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{renderMovieCards(getFavoriteMovies())}
						</div>
					</TabsContent>

					{/* Reviews Content */}
					<TabsContent value="reviews" className="py-6">
						<div className="flex-1 flex-col gap-4">
							{getMoviesWithReviews().length === 0 ? (
								<div className="text-center py-8">
									<p className="text-muted-foreground">
										You haven't reviewed any movies yet
									</p>
								</div>
							) : (
								getMoviesWithReviews().map(({ review, movie }) => (
									<ReviewCard
										key={review.movieId}
										review={review}
										movie={movie}
										onEdit={() => openEditReview(review)}
										onDelete={() => handleDeleteReview()}
										viewOnly={viewOnly}
									/>
								))
							)}
						</div>
					</TabsContent>

					{/* Watched Content */}
					<TabsContent value="watched" className="py-6">
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{renderMovieCards(profile?.movies?.filter(movie =>
								profile?.watched?.map(w => w.movieId).includes(movie.id),
							) || [])}
						</div>
					</TabsContent>
				</Tabs>

				{
					!viewOnly && (
						<>
							{/* Edit Display Name Dialog */}
							<Dialog open={isDisplayNameDialogOpen} onOpenChange={setIsDisplayNameDialogOpen}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Edit Display Name</DialogTitle>
										<DialogDescription>
											Update how your name appears to others
										</DialogDescription>
									</DialogHeader>

									<ShadcnForm {...displayNameForm}>
										<form
											onSubmit={displayNameForm.handleSubmit(handleUpdateDisplayName)}
											className="space-y-4"
										>
											<FormField
												control={displayNameForm.control}
												name="displayName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Display Name</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<DialogFooter>
												<Button
													variant="outline"
													type="button"
													onClick={() => setIsDisplayNameDialogOpen(false)}
												>
													Cancel
												</Button>
												<Button type="submit">Save Changes</Button>
											</DialogFooter>
										</form>
									</ShadcnForm>
								</DialogContent>
							</Dialog>

							{/* Change Password Dialog */}
							<Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Change Password</DialogTitle>
										<DialogDescription>
											We'll send a password reset link to your email address
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4">
										<p className="text-sm text-muted-foreground">
											Enter your email address to receive a password reset link:
										</p>

										<div className="bg-muted rounded-lg p-4">
											<div className="font-medium">{currentUser?.email}</div>
										</div>

										<p className="text-sm text-muted-foreground">
											You'll receive an email with instructions to reset your password.
										</p>
									</div>

									<DialogFooter>
										<Button
											variant="outline"
											type="button"
											onClick={() => setIsPasswordDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button onClick={handlePasswordReset}>Send Reset Link</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							{/* Edit Review Dialog */}
							<Dialog open={isEditReviewOpen} onOpenChange={setIsEditReviewOpen}>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											{currentReviewMovie?.feedback.rating
												? 'Edit Your Review'
												: 'Add a Review'}
										</DialogTitle>
										<DialogDescription>
											Share your thoughts about this movie
										</DialogDescription>
									</DialogHeader>

									<ShadcnForm {...reviewForm}>
										<form
											onSubmit={reviewForm.handleSubmit(handleReviewSubmit)}
											className="space-y-4"
										>
											<FormField
												control={reviewForm.control}
												name="rating"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Rating *</FormLabel>
														<FormControl>
															<div className="flex items-center">
																{[1, 2, 3, 4, 5].map(star => (
																	<button
																		key={star}
																		type="button"
																		onClick={() => field.onChange(star)}
																		className="p-1"
																	>
																		<Star
																			className={cn(
																				'h-6 w-6 transition-colors',
																				star <= field.value
																					? 'fill-yellow-500 text-yellow-500'
																					: 'text-muted-foreground',
																			)}
																		/>
																	</button>
																))}
																<div className="ml-2 text-sm text-muted-foreground">
																	{field.value > 0
																		? `${field.value} star${field.value > 1 ? 's' : ''}`
																		: 'Not rated'}
																</div>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={reviewForm.control}
												name="content"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Review (optional)</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																placeholder="Write your thoughts about this movie..."
																className="min-h-[120px]"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<DialogFooter>
												<div className="flex justify-between w-full">
													<div className="flex gap-2">
														<Button
															variant="outline"
															type="button"
															onClick={() => setIsEditReviewOpen(false)}
														>
															Cancel
														</Button>
														<Button type="submit">Save Review</Button>
													</div>
												</div>
											</DialogFooter>
										</form>
									</ShadcnForm>
								</DialogContent>
							</Dialog>
						</>
					)
				}
			</div>
		</TooltipProvider>
	)
}