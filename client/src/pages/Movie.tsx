// src/pages/Movie.tsx
import { Link, type Params, useLoaderData } from 'react-router'
import { useEffect, useState } from 'react'
import { get } from '@/api'
import type { Cast, Crew, Image, MovieDetailsResponse, Review, Video } from '@/types/movie'
import { Calendar, Clock, Film, Globe, PlayCircle, Star, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import MovieCard from '@/components/custom/MovieCard'

export async function movieLoader({ params }: { params: Params }) {
	const { id } = params
	const defaultResponse: MovieDetailsResponse = {
		id: 0,
		title: '',
		overview: '',
		poster_path: null,
		backdrop_path: null,
		release_date: '',
		runtime: 0,
		vote_average: 0,
		vote_count: 0,
		genres: [],
		production_companies: [],
		production_countries: [],
		spoken_languages: [],
		status: '',
		tagline: '',
		budget: 0,
		revenue: 0,
		original_language: '',
		original_title: '',
		imdb_id: null,
		homepage: null,
		adult: false,
		popularity: 0,
		videos: {
			results: [],
		},
		credits: {
			cast: [],
			crew: [],
		},
		reviews: {
			results: [],
			page: 1,
			total_pages: 0,
			total_results: 0,
		},
		images: {
			backdrops: [],
			posters: [],
			logos: [],
		},
		external_ids: {
			imdb_id: null,
			facebook_id: null,
			instagram_id: null,
			twitter_id: null,
			wikidata_id: null,
		},
		similar: {
			results: [],
			page: 1,
			total_pages: 0,
			total_results: 0,
		},
	}

	if (!id || isNaN(Number(id))) {
		return defaultResponse
	}

	try {
		return await get<MovieDetailsResponse>(`/movie/${id}`)
	} catch (error) {
		console.error('Error loading movie data:', error)
		return {
			...defaultResponse,
			id: parseInt(id, 10),
			title: 'Movie Not Found',
		}
	}
}

const groupCrewByRole = (crew: Crew[]) => {
	const grouped: Record<string, Crew[]> = {}
	const roleOrder: string[] = []

	crew.forEach(person => {
		if (!grouped[person.job]) {
			grouped[person.job] = []
			roleOrder.push(person.job)
		}
		grouped[person.job].push(person)
	})

	return roleOrder.map(role => ({ role, members: grouped[role] }))
}

export default function MoviePage() {
	const loaderData = useLoaderData() as MovieDetailsResponse
	const [isLoading, setIsLoading] = useState(true)
	const [currentVideo, setCurrentVideo] = useState<Video | null>(null) // Changed to store video object
	const [selectedTab, setSelectedTab] = useState('overview')
	const [trailer, setTrailer] = useState<Video | null>(null) // Added to store trailer separately

	useEffect(() => {
		if (loaderData.id) {
			setIsLoading(false)

			// Find a trailer but don't show it immediately
			const trailer = loaderData.videos?.results?.find(v => v.type === 'Trailer')
			if (trailer) setTrailer(trailer)
		}
	}, [loaderData])

	if (!loaderData.id) {
		return (
			<div className="container py-12 text-center">
				<h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
				<p className="text-muted-foreground mb-6">
					The movie you're looking for doesn't exist or has been removed.
				</p>
				<Button asChild>
					<Link to="/">Browse Movies</Link>
				</Button>
			</div>
		)
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
	const groupedCrew = groupCrewByRole(getCrew())

	// Added function to handle trailer play
	const handlePlayTrailer = () => {
		if (trailer) setCurrentVideo(trailer)
	}

	return (
		<div className="flex flex-col min-h-screen w-full">
			{/* Hero Section - Removed backdrop */}
			<div className="relative">
				<div className="container relative z-20">
					<div className="flex flex-col md:flex-row gap-8">
						{/* Movie Poster */}
						<div className="w-full md:w-1/4 max-w-[250px]"> {/* Changed from md:w-1/3 lg:w-1/4 */}
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
						<div className="w-full md:w-2/3 lg:w-3/4 text-white">
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
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview">
						<div className="flex flex-col lg:flex-row gap-8">
							{/* Main Content */}
							<div className="flex-1 min-w-0">
								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-bold mb-4">Storyline</h2>
										<p className="text-lg">{loaderData.omdb?.Plot || loaderData.overview || 'No overview available.'}</p>
									</div>

									{getCast().length > 0 && (
										<div>
											<h2 className="text-2xl font-bold mb-4">Top Cast</h2>
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
												{getCast().map(person => (
													<div key={person.id} className="flex items-center gap-4">
														<div
															className="w-16 h-16 rounded-full overflow-hidden bg-muted">
															{person.profile_path ? (
																<img
																	src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
																	alt={person.name}
																	className="w-full h-full object-cover"
																/>
															) : (
																<div
																	className="w-full h-full flex items-center justify-center">
																	<Users className="h-6 w-6 text-muted-foreground" />
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
										</div>
									)}
								</div>
							</div>

							{/* Sidebar - Facts and Crew */}
							{(loaderData.status ||
								loaderData.original_title ||
								loaderData.budget > 0 ||
								loaderData.revenue > 0 ||
								loaderData.production_companies?.length > 0 ||
								loaderData.production_countries?.length > 0 ||
								loaderData.omdb ||
								getCrew().length > 0) && (
								<div className="lg:w-1/3 min-w-[300px] space-y-8">
									{/* Facts Section - Enhanced with OMDB */}
									<div>
										<h3 className="text-lg font-semibold mb-2">Facts</h3>
										<div className="space-y-3">
											{/* Content Rating */}
											{loaderData.omdb?.Rated && loaderData.omdb.Rated !== 'N/A' && (
												<div>
													<p className="text-sm text-muted-foreground">Content Rating</p>
													<p>{loaderData.omdb.Rated}</p>
												</div>
											)}

											{/* Status */}
											{loaderData.status && (
												<div>
													<p className="text-sm text-muted-foreground">Status</p>
													<p>{loaderData.status}</p>
												</div>
											)}

											{/* Original Title */}
											{loaderData.original_title && loaderData.original_title !== loaderData.title && (
												<div>
													<p className="text-sm text-muted-foreground">Original Title</p>
													<p>{loaderData.original_title}</p>
												</div>
											)}

											{/* Budget */}
											{loaderData.budget > 0 && (
												<div>
													<p className="text-sm text-muted-foreground">Budget</p>
													<p>{formatCurrency(loaderData.budget)}</p>
												</div>
											)}

											{/* Revenue */}
											{loaderData.revenue > 0 && (
												<div>
													<p className="text-sm text-muted-foreground">Revenue</p>
													<p>{formatCurrency(loaderData.revenue)}</p>
												</div>
											)}

											{/* Box Office */}
											{loaderData.omdb?.BoxOffice && loaderData.omdb.BoxOffice !== 'N/A' && (
												<div>
													<p className="text-sm text-muted-foreground">Box Office</p>
													<p>{loaderData.omdb.BoxOffice}</p>
												</div>
											)}

											{/* Awards */}
											{loaderData.omdb?.Awards && loaderData.omdb.Awards !== 'N/A' && (
												<div>
													<p className="text-sm text-muted-foreground">Awards</p>
													<p>{loaderData.omdb.Awards}</p>
												</div>
											)}

											{/* DVD Release */}
											{loaderData.omdb?.DVD && loaderData.omdb.DVD !== 'N/A' && (
												<div>
													<p className="text-sm text-muted-foreground">DVD Release</p>
													<p>{loaderData.omdb.DVD}</p>
												</div>
											)}

											{/* Production Companies */}
											{loaderData.production_companies?.length > 0 && (
												<div>
													<p className="text-sm text-muted-foreground">Production
														Companies</p>
													<div className="flex flex-wrap gap-2 mt-1">
														{loaderData.production_companies.map(company => (
															<span key={company.id}
																  className="px-2 py-1 bg-muted rounded text-sm">
                                {company.name}
                              </span>
														))}
													</div>
												</div>
											)}

											{/* Production Countries */}
											{loaderData.production_countries?.length > 0 && (
												<div>
													<p className="text-sm text-muted-foreground">Production
														Countries</p>
													<div className="flex flex-wrap gap-2 mt-1">
														{loaderData.production_countries.map(country => (
															<span key={country.iso_3166_1}
																  className="px-2 py-1 bg-muted rounded text-sm">
                                {country.name}
                              </span>
														))}
													</div>
												</div>
											)}

											{/* Website */}
											{loaderData.omdb?.Website && loaderData.omdb.Website !== 'N/A' && (
												<div>
													<p className="text-sm text-muted-foreground">Website</p>
													<a
														href={loaderData.omdb.Website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-primary hover:underline"
													>
														Official Site
													</a>
												</div>
											)}
										</div>
									</div>

									{/* Crew Section - Multi-column */}
									{groupedCrew.length > 0 && (
										<div>
											<h3 className="text-lg font-semibold mb-2">Crew</h3>
											<div className="columns-1 sm:columns-2 gap-4 space-y-4">
												{groupedCrew.map(({ role, members }) => (
													<div key={role} className="break-inside-avoid">
														<h4 className="font-medium text-muted-foreground">{role}</h4>
														<div className="space-y-2 mt-1">
															{members.map(person => (
																<div key={person.id}
																	 className="flex items-center gap-2">
																	<div className="flex-shrink-0">
																		{person.profile_path ? (
																			<img
																				src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
																				alt={person.name}
																				className="w-8 h-8 rounded-full object-cover"
																			/>
																		) : (
																			<div
																				className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
																				<Users
																					className="h-3 w-3 text-muted-foreground" />
																			</div>
																		)}
																	</div>
																	<div className="min-w-0">
																		<p className="font-semibold truncate text-sm">{person.name}</p>
																	</div>
																</div>
															))}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</TabsContent>

					{/* Cast & Crew Tab */}
					<TabsContent value="cast">
						<div className="space-y-8">
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
												<span className="text-lg">Play Trailer</span>
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