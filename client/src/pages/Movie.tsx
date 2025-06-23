// src/pages/Movie.tsx
import { Link, useLoaderData, useNavigation } from 'react-router'
import { useContext, useEffect, useState } from 'react'
import type { Cast, Crew, Image, MovieDetailsResponse, Review, Video } from '@/types/movie'
import { Bookmark, Calendar, Clock, Film, Globe, Heart, PlayCircle, Star, Trash2, Users, X } from 'lucide-react'
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
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Skeleton,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
} from '@/components/ui'
import MovieCard from '@/components/custom/MovieCard'
import { AuthContext, ProfileContext } from '@/components/contexts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'

// Define validation schema
const reviewFormSchema = z.object({
	rating: z
		.number()
		.min(1, 'Please select a rating')
		.max(5, 'Rating must be between 1-5'),
	content: z
		.string()
		.max(1000, 'Review cannot exceed 1000 characters')
		.optional(),
})

export default function MoviePage() {
	const loaderData = useLoaderData() as MovieDetailsResponse
	const navigation = useNavigation()
	const [isLoading, setIsLoading] = useState(true)
	const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
	const [selectedTab, setSelectedTab] = useState('overview')
	const [trailer, setTrailer] = useState<Video | null>(null)

	// Alert dialog states
	const [showRemoveWatchlistDialog, setShowRemoveWatchlistDialog] = useState(false)
	const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false)
	const [showDeleteReviewDialog, setShowDeleteReviewDialog] = useState(false)

	const { currentUser: user } = useContext(AuthContext)
	const {
		profile,
		addToWatchlist,
		removeFromWatchlist,
		favoriteMovie,
		unfavoriteMovie,
		addReview,
		updateReview,
		deleteReview,
	} = useContext(ProfileContext)

	// Initialize form with react-hook-form and zod
	const form = useForm<z.infer<typeof reviewFormSchema>>({
		resolver: zodResolver(reviewFormSchema),
		defaultValues: {
			rating: 0,
			content: '',
		},
	})

	useEffect(() => {
		if (loaderData.id) {
			setIsLoading(false)
			const trailer = loaderData.videos?.results?.find(v => v.type === 'Trailer')
			if (trailer) setTrailer(trailer)

			// Check if user has already reviewed this movie
			if (user && profile) {
				const userReview = profile.watched?.find(r => r.movieId === loaderData.id && (r.feedback.rating !== null || r.feedback.content !== null))
				if (userReview) {
					// Update form with existing review
					form.reset({
						rating: userReview.feedback.rating || 0,
						content: userReview.feedback.content || '',
					})
				}
			}
		}
	}, [loaderData, user, profile, form])

	// Determine bookmark and favorite status
	const isBookmarked = profile?.watchlist?.includes(loaderData.id) ?? false
	const isFavorited = profile?.watched?.some(
		w => w.movieId === loaderData.id && w.isFavorited,
	) ?? false
	const userReview = profile?.watched?.find(
		r => r.movieId === loaderData.id && (r.feedback.rating !== null || r.feedback.content !== null),
	)

	// Handle watchlist actions
	const handleAddToWatchlist = async () => {
		return await addToWatchlist(loaderData.id)
	}

	const handleRemoveFromWatchlist = async () => {
		return await removeFromWatchlist(loaderData.id)
	}

	// Handle favorite actions
	const handleAddToFavorites = async () => {
		return await favoriteMovie(loaderData.id)
	}

	const handleRemoveFromFavorites = async () => {
		return await unfavoriteMovie(loaderData.id)
	}

	// Form submission handler
	const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
		if (!user) return

		// Trim text and handle empty strings
		const text = values.content?.trim() || null

		if (userReview) {
			return await updateReview(loaderData.id, values.rating, text)
		} else {
			return await addReview(loaderData.id, values.rating, text)
				.then(() => {
					form.reset({
						rating: 0,
						content: '',
					})
				})
		}
	}

	const handleConfirmDeleteReview = async () => {
		if (!user || !userReview) return

		await deleteReview(loaderData.id)
			.then(() => {
				form.reset({
					rating: 0,
					content: '',
				})
				setShowDeleteReviewDialog(false)
			})
	}

	const formatCurrency = (amount: number) => {
		return amount.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		})
	}

	const formatRuntime = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return `${hours}h ${mins}m`
	}

	// Helper functions to safely access data
	const getCast = (): Cast[] => loaderData.credits?.cast || []
	const getCrew = (): Crew[] => loaderData.credits?.crew || []
	const getVideos = (): Video[] => loaderData.videos?.results || []
	const getBackdrops = (): Image[] => loaderData.images?.backdrops || []
	const getPosters = (): Image[] => loaderData.images?.posters || []
	const getReviews = (): Review[] => loaderData.reviews?.results || []
	const getSimilarMovies = () => loaderData.similar?.results || []

	// Added function to handle trailer play
	const handlePlayTrailer = () => {
		if (trailer) setCurrentVideo(trailer)
	}

	const isSubmitting = navigation.state === 'submitting'

	return (
		<div className="flex flex-col min-h-screen w-full">
			{/* Alert Dialogs */}
			{/* Remove from Watchlist Dialog */}
			<AlertDialog open={showRemoveWatchlistDialog} onOpenChange={setShowRemoveWatchlistDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove from Watchlist?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove "{loaderData.title}" from your watchlist?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRemoveFromWatchlist}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Remove from Favorites Dialog */}
			<AlertDialog open={showRemoveFavoriteDialog} onOpenChange={setShowRemoveFavoriteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove "{loaderData.title}" from your favorites?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRemoveFromFavorites}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Review Dialog */}
			<AlertDialog open={showDeleteReviewDialog} onOpenChange={setShowDeleteReviewDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Your Review?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to permanently delete your review for "{loaderData.title}"?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDeleteReview}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Hero Section */}
			<div className="relative text-white">
				<div className="container relative z-20 py-12">
					<div className="flex flex-col md:flex-row gap-8">
						{/* Movie Poster */}
						<div className="w-full md:w-1/4 max-w-[250px]">
							{isLoading ? (
								<Skeleton className="aspect-[2/3] rounded-xl" />
							) : loaderData.poster_path ? (
								<img
									src={`https://image.tmdb.org/t/p/w500${loaderData.poster_path}`}
									alt={loaderData.title}
									className="w-full rounded-xl shadow-xl"
								/>
							) : (
								<div className="aspect-[2/3] rounded-xl bg-muted flex items-center justify-center">
									<Film className="h-16 w-16 text-muted-foreground" />
								</div>
							)}
						</div>

						{/* Movie Info */}
						<div className="flex-1 min-w-0">
							{isLoading ? (
								<>
									<Skeleton className="h-10 w-3/4 mb-4" />
									<div className="flex gap-4 mb-6">
										<Skeleton className="h-6 w-24" />
										<Skeleton className="h-6 w-24" />
										<Skeleton className="h-6 w-24" />
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-5/6" />
										<Skeleton className="h-4 w-4/5" />
									</div>
								</>
							) : (
								<>
									<h1 className="text-4xl md:text-5xl font-bold mb-2">
										{loaderData.title}{' '}
										{loaderData.release_date && `(${new Date(loaderData.release_date).getFullYear()})`}
									</h1>

									<div className="flex flex-wrap items-center gap-4 mb-6">
										<div
											className="flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full">
											<Star className="h-4 w-4 mr-1" />
											<div>{loaderData.vote_average.toFixed(1)}</div>
										</div>

										{loaderData.release_date && (
											<div className="flex items-center">
												<Calendar className="h-4 w-4 mr-1" />
												<div>
													{new Date(loaderData.release_date).toLocaleDateString('en-US', {
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													})}
												</div>
											</div>
										)}

										{loaderData.runtime > 0 && (
											<div className="flex items-center">
												<Clock className="h-4 w-4 mr-1" />
												<div>{formatRuntime(loaderData.runtime)}</div>
											</div>
										)}

										{loaderData.original_language && (
											<div className="flex items-center">
												<Globe className="h-4 w-4 mr-1" />
												<div className="uppercase">{loaderData.original_language}</div>
											</div>
										)}
									</div>

									<div className="flex flex-wrap gap-2 mb-6">
										{loaderData.genres.map(genre => (
											<div
												key={genre.id}
												className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
											>
												{genre.name}
											</div>
										))}
									</div>

									<p className="text-lg mb-6 max-w-3xl">{loaderData.overview}</p>
								</>
							)}
						</div>

						{/* Action Panel */}
						<div className="w-full md:w-80 space-y-8">
							{/* Watchlist & Favorite Buttons */}
							<div className="flex flex-col gap-4">
								{isBookmarked ? (
									<Button
										variant="default"
										className="w-full"
										onClick={() => setShowRemoveWatchlistDialog(true)}
										disabled={isSubmitting}
									>
										<Bookmark className="h-4 w-4 mr-2 fill-white" />
										Remove from Watchlist
									</Button>
								) : (
									<Button
										variant="outline"
										className="w-full"
										onClick={handleAddToWatchlist}
										disabled={isSubmitting}
									>
										<Bookmark className="h-4 w-4 mr-2" />
										Add to Watchlist
									</Button>
								)}

								{isFavorited ? (
									<Button
										variant="destructive"
										className="w-full"
										onClick={() => setShowRemoveFavoriteDialog(true)}
										disabled={isSubmitting}
									>
										<Heart className="h-4 w-4 mr-2 fill-white" />
										Remove from Favorites
									</Button>
								) : (
									<Button
										variant="outline"
										className="w-full"
										onClick={handleAddToFavorites}
										disabled={isSubmitting}
									>
										<Heart className="h-4 w-4 mr-2" />
										Add to Favorites
									</Button>
								)}
							</div>

							{/* Review Section */}
							{user ? (
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="bg-secondary rounded-lg p-6 space-y-4"
									>
										<h3 className="text-lg font-semibold">Your Review</h3>

										{/* Star Rating */}
										<FormField
											control={form.control}
											name="rating"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-white">Rating *</FormLabel>
													<FormControl>
														<div className="flex items-center">
															{[1, 2, 3, 4, 5].map(star => (
																<button
																	key={star}
																	type="button"
																	onClick={() => field.onChange(star)}
																	className="p-1"
																	disabled={isSubmitting}
																>
																	<Star
																		className={cn(
																			'h-6 w-6 transition-colors',
																			star <= field.value
																				? 'fill-yellow-500 text-yellow-500'
																				: 'text-gray-400',
																		)}
																	/>
																</button>
															))}
															<div className="ml-2 text-sm text-gray-300">
																{field.value > 0 ? `${field.value} star${field.value > 1 ? 's' : ''}` : 'Not rated'}
															</div>
														</div>
													</FormControl>
													<FormMessage className="text-red-400" />
												</FormItem>
											)}
										/>

										{/* Review Textarea */}
										<FormField
											control={form.control}
											name="content"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-white">Review (optional)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															placeholder="Write your thoughts about this movie..."
															className="min-h-[120px] bg-gray-700/50 border-gray-600 text-white"
															disabled={isSubmitting}
														/>
													</FormControl>
													<FormMessage className="text-red-400" />
												</FormItem>
											)}
										/>

										{/* Action Buttons */}
										<div className="flex gap-2">
											<Button
												type="submit"
												disabled={isSubmitting || !form.formState.isDirty}
												className="flex-1"
											>
												{userReview ? 'Update Review' : 'Submit Review'}
											</Button>

											{userReview && (
												<Button
													variant="destructive"
													size="icon"
													onClick={() => setShowDeleteReviewDialog(true)}
													disabled={isSubmitting}
													type="button"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											)}
										</div>
									</form>
								</Form>
							) : (
								<div className="text-center p-6 bg-gray-800/50 rounded-lg">
									<p className="text-gray-300 mb-4">
										Sign in to add this movie to your lists and leave a review
									</p>
									<Button asChild variant="outline">
										<Link to="/login">Sign In</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container py-8">
				<Tabs value={selectedTab} onValueChange={setSelectedTab}>
					<TabsList className="grid w-full grid-cols-4 mb-8">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="cast">Cast & Crew</TabsTrigger>
						<TabsTrigger value="media">Media</TabsTrigger>
						<TabsTrigger value="reviews">TMDB Reviews</TabsTrigger>
						<TabsTrigger value="reviews_local">MovieHub Reviews</TabsTrigger>
					</TabsList>

					{/* Overview Tab - Restructured as single column */}
					<TabsContent value="overview">
						<div className="space-y-12">
							{/* Storyline Section */}
							<section>
								<h2 className="text-2xl font-bold mb-4">Storyline</h2>
								<p className="text-lg">{loaderData.omdb?.Plot || loaderData.overview || 'No overview available.'}</p>
							</section>

							{/* Facts Section */}
							{(loaderData.status ||
								loaderData.original_title ||
								loaderData.budget > 0 ||
								loaderData.revenue > 0 ||
								loaderData.production_companies?.length > 0 ||
								loaderData.production_countries?.length > 0 ||
								loaderData.omdb) && (
								<section>
									<h2 className="text-2xl font-bold mb-4">Facts</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{/* Content Rating */}
										{loaderData.omdb?.Rated && loaderData.omdb.Rated !== 'N/A' && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Content Rating</h3>
												<p className="font-medium">{loaderData.omdb.Rated}</p>
											</div>
										)}

										{/* Status */}
										{loaderData.status && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Status</h3>
												<p className="font-medium">{loaderData.status}</p>
											</div>
										)}

										{/* Original Title */}
										{loaderData.original_title && loaderData.original_title !== loaderData.title && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Original Title</h3>
												<p className="font-medium">{loaderData.original_title}</p>
											</div>
										)}

										{/* Budget */}
										{loaderData.budget > 0 && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Budget</h3>
												<p className="font-medium">{formatCurrency(loaderData.budget)}</p>
											</div>
										)}

										{/* Revenue */}
										{loaderData.revenue > 0 && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Revenue</h3>
												<p className="font-medium">{formatCurrency(loaderData.revenue)}</p>
											</div>
										)}

										{/* Box Office */}
										{loaderData.omdb?.BoxOffice && loaderData.omdb.BoxOffice !== 'N/A' && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Box Office</h3>
												<p className="font-medium">{loaderData.omdb.BoxOffice}</p>
											</div>
										)}

										{/* Awards */}
										{loaderData.omdb?.Awards && loaderData.omdb.Awards !== 'N/A' && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Awards</h3>
												<p className="font-medium">{loaderData.omdb.Awards}</p>
											</div>
										)}

										{/* DVD Release */}
										{loaderData.omdb?.DVD && loaderData.omdb.DVD !== 'N/A' && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">DVD Release</h3>
												<p className="font-medium">{loaderData.omdb.DVD}</p>
											</div>
										)}

										{/* Production Companies */}
										{loaderData.production_companies?.length > 0 && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Production Companies</h3>
												<div className="flex flex-wrap gap-2 mt-1">
													{loaderData.production_companies.map(company => (
														<div key={company.id} className="text-sm">
															{company.name}
														</div>
													))}
												</div>
											</div>
										)}

										{/* Production Countries */}
										{loaderData.production_countries?.length > 0 && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Production Countries</h3>
												<div className="flex flex-wrap gap-2 mt-1">
													{loaderData.production_countries.map(country => (
														<div key={country.iso_3166_1} className="text-sm">
															{country.name}
														</div>
													))}
												</div>
											</div>
										)}

										{/* Website */}
										{loaderData.omdb?.Website && loaderData.omdb.Website !== 'N/A' && (
											<div className="bg-muted p-4 rounded-lg">
												<h3 className="text-sm text-muted-foreground">Website</h3>
												<a
													href={loaderData.omdb.Website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline font-medium"
												>
													Official Site
												</a>
											</div>
										)}
									</div>
								</section>
							)}

							{/* Top Cast Section */}
							{getCast().length > 0 && (
								<section>
									<h2 className="text-2xl font-bold mb-4">Top Cast</h2>
									<div
										className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
										{getCast().map(person => (
											<div key={person.id} className="flex flex-col items-center text-center">
												<div className="w-24 h-24 rounded-full overflow-hidden bg-muted mb-2">
													{person.profile_path ? (
														<img
															src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
															alt={person.name}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center">
															<Users className="h-10 w-10 text-muted-foreground" />
														</div>
													)}
												</div>
												<div>
													<h3 className="font-bold">{person.name}</h3>
													<p className="text-sm text-muted-foreground">{person.character}</p>
												</div>
											</div>
										))}
									</div>
								</section>
							)}
						</div>
					</TabsContent>

					{/* Cast & Crew Tab - Now includes both Cast and Crew */}
					<TabsContent value="cast">
						<div className="space-y-12">
							{/* Cast Section */}
							<section>
								<h2 className="text-2xl font-bold mb-6">Cast</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
									{getCast().map(person => (
										<div key={person.id} className="bg-muted rounded-lg overflow-hidden">
											<div className="aspect-[2/3] bg-muted">
												{person.profile_path ? (
													<img
														src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
														alt={person.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<Users className="h-12 w-12 text-muted-foreground" />
													</div>
												)}
											</div>
											<div className="p-4">
												<h3 className="font-bold truncate">{person.name}</h3>
												<p className="text-sm text-muted-foreground truncate">{person.character}</p>
											</div>
										</div>
									))}
								</div>
							</section>

							{/* Crew Section */}
							{getCrew().length > 0 && (
								<section>
									<h2 className="text-2xl font-bold mb-6">Crew</h2>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
										{getCrew().map(person => (
											<div key={person.id}
												 className="bg-muted rounded-lg p-4 flex items-center gap-4">
												<div className="flex-shrink-0">
													{person.profile_path ? (
														<img
															src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
															alt={person.name}
															className="w-16 h-16 rounded-full object-cover"
														/>
													) : (
														<div
															className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
															<Users className="h-6 w-6 text-muted-foreground" />
														</div>
													)}
												</div>
												<div className="min-w-0">
													<h3 className="font-bold truncate">{person.name}</h3>
													<p className="text-sm text-muted-foreground truncate">{person.job}</p>
												</div>
											</div>
										))}
									</div>
								</section>
							)}
						</div>
					</TabsContent>

					{/* Media Tab */}
					<TabsContent value="media">
						<div className="space-y-12">
							{/* New Trailer Section */}
							{trailer && (
								<section>
									<h2 className="text-2xl font-bold mb-6">Trailer</h2>
									<div className="relative rounded-xl overflow-hidden bg-black aspect-video">
										{loaderData.backdrop_path ? (
											<img
												src={`https://image.tmdb.org/t/p/original${loaderData.backdrop_path}`}
												alt={loaderData.title}
												className="w-full h-full object-cover opacity-50"
											/>
										) : (
											<div
												className="w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10" />
										)}

										<div className="absolute inset-0 flex items-center justify-center">
											<Button
												size="lg"
												className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
												onClick={handlePlayTrailer}
											>
												<PlayCircle className="h-8 w-8" />
												<div className="text-lg">Play Trailer</div>
											</Button>
										</div>

										<div
											className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
											<h3 className="text-xl font-bold">{trailer.name}</h3>
											<p className="text-muted-foreground">{trailer.type}</p>
										</div>
									</div>
								</section>
							)}

							{/* Existing Videos Section */}
							{getVideos().length > 0 && (
								<section>
									<h2 className="text-2xl font-bold mb-6">Videos</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{getVideos()
											.filter(v => v.type !== 'Trailer') // Exclude trailer since we have dedicated section
											.map(video => (
												<div key={video.id} className="bg-muted rounded-lg overflow-hidden">
													<div
														className="aspect-video bg-black cursor-pointer relative"
														onClick={() => setCurrentVideo(video)}
													>
														<img
															src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
															alt={video.name}
															className="w-full h-full object-cover opacity-90"
														/>
														<div
															className="absolute inset-0 flex items-center justify-center">
															<PlayCircle className="h-16 w-16 text-white" />
														</div>
														<div
															className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
															<h3 className="font-bold text-white">{video.name}</h3>
															<p className="text-sm text-muted-foreground">
																{video.type} • {video.size}p
															</p>
														</div>
													</div>
												</div>
											))}
									</div>
								</section>
							)}

							{getBackdrops().length > 0 && (
								<section>
									<h2 className="text-2xl font-bold mb-6">Backdrops</h2>
									<Carousel className="w-full">
										<CarouselContent>
											{getBackdrops().map(image => (
												<CarouselItem key={image.file_path}
															  className="basis-1/2 md:basis-1/3 lg:basis-1/4">
													<div className="bg-muted rounded-lg overflow-hidden">
														<img
															src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
															alt="Movie backdrop"
															className="w-full h-48 object-cover"
														/>
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
										<CarouselPrevious />
										<CarouselNext />
									</Carousel>
								</section>
							)}

							{getPosters().length > 0 && (
								<section>
									<h2 className="text-2xl font-bold mb-6">Posters</h2>
									<Carousel className="w-full">
										<CarouselContent>
											{getPosters().map(image => (
												<CarouselItem key={image.file_path}
															  className="basis-1/2 md:basis-1/3 lg:basis-1/4">
													<div className="bg-muted rounded-lg overflow-hidden">
														<img
															src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
															alt="Movie poster"
															className="w-full h-64 object-cover"
														/>
													</div>
												</CarouselItem>
											))}
										</CarouselContent>
										<CarouselPrevious />
										<CarouselNext />
									</Carousel>
								</section>
							)}
						</div>
					</TabsContent>

					{/* Reviews Tab */}
					<TabsContent value="reviews">
						<div className="space-y-6">
							{getReviews().length > 0 ? (
								getReviews().map(review => (
									<div key={review.id} className="bg-muted rounded-lg p-6">
										<div className="flex items-center gap-4 mb-4">
											<div
												className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
												{review.author.charAt(0)}
											</div>
											<div>
												<h3 className="font-bold">{review.author}</h3>
												<div className="flex items-center gap-2">
													<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
													<div>{review.author_details.rating || 'N/A'}</div>
													<div>•</div>
													<div className="text-sm text-muted-foreground">
														{new Date(review.created_at).toLocaleDateString('en-US', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														})}
													</div>
												</div>
											</div>
										</div>
										<p className="line-clamp-4">{review.content}</p>
										<Button variant="link" className="p-0 mt-2">
											Read full review
										</Button>
									</div>
								))
							) : (
								<div className="text-center py-12">
									<h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
									<p className="text-muted-foreground">
										Be the first to review this movie
									</p>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="reviews_local">
						<div className="space-y-6">
							{loaderData.feedback.length > 0 ? (
								loaderData.feedback.map((fb, index) => (
									<div key={index} className="bg-muted rounded-lg p-6">
										<div className="flex items-center gap-4 mb-4">
											<div
												className="w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center">
												{fb.user.charAt(0)}
											</div>
											<div>
												<h3 className="font-bold">{fb.user}</h3>
												<div className="flex items-center gap-2">
													{fb.rating && (
														<>
															<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
															<div>{fb.rating.toFixed(1)}</div>
															<div>•</div>
														</>
													)}
													<div className="text-sm text-muted-foreground">
														{new Date(fb.createdAt).toLocaleDateString('en-US', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														})}
													</div>
												</div>
											</div>
										</div>

										{fb.review && (
											<p className="line-clamp-4">{fb.review}</p>
										)}
									</div>
								))
							) : (
								<div className="text-center py-12">
									<h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
									<p className="text-muted-foreground">
										Be the first to review this movie
									</p>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>

				{/* Similar Movies */}
				{getSimilarMovies().length > 0 && (
					<section className="mt-16">
						<h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
						<Carousel className="w-full">
							<CarouselContent>
								{getSimilarMovies().map(movie => (
									<CarouselItem key={movie.id}
												  className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
										<MovieCard movie={movie} genres={loaderData.genres} />
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</section>
				)}
			</div>

			{/* Trailer Modal */}
			{currentVideo && (
				<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
					<div className="w-full max-w-4xl">
						<div className="relative aspect-video">
							<iframe
								src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1`}
								title={currentVideo.name}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="w-full h-full rounded-lg"
							></iframe>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-4 right-4 text-white hover:bg-white/10"
							onClick={() => setCurrentVideo(null)}
						>
							<X className="h-6 w-6" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}