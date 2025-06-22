// src/pages/Home.tsx
import { Link, useLoaderData } from 'react-router'
import { useEffect, useState } from 'react'
import type { DiscoverResponse, DiscoverResponseResult } from '@/types/discover'
import type { Genre } from '@/types/genre'
import MovieCard from '@/components/custom/MovieCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

// src/pages/Home.tsx
export default function Home() {
	const loaderData = useLoaderData() as {
		discover: {
			popular: DiscoverResponse
			now_playing: DiscoverResponse
			top_rated: DiscoverResponse
			upcoming: DiscoverResponse
		}
		genres: Genre[]
	}
	const [featuredMovie, setFeaturedMovie] = useState<DiscoverResponseResult | null>(null)
	const [isLoadingHero, setIsLoadingHero] = useState(true)
	const [isLoadingCarousels, setIsLoadingCarousels] = useState(true)

	useEffect(() => {
		if (loaderData.discover.popular.results.length > 0) {
			setFeaturedMovie(loaderData.discover.popular.results[0])
			setIsLoadingHero(false)
			setIsLoadingCarousels(false)
		}
	}, [loaderData])

	// Category titles mapping
	const categoryTitles: Record<string, string> = {
		popular: 'Popular Movies',
		now_playing: 'Now Playing',
		top_rated: 'Top Rated',
		upcoming: 'Upcoming Movies',
	}

	// Render skeleton cards for loading state
	const renderSkeletonCards = (count: number) => (
		<div className="flex gap-4">
			{Array(count)
				.fill(0)
				.map((_, i) => (
					<div key={i} className="w-[150px] md:w-[180px]">
						<Skeleton className="aspect-[2/3] rounded-lg" />
						<div className="mt-3 space-y-2">
							<Skeleton className="h-4 w-4/5" />
							<Skeleton className="h-3 w-1/3" />
						</div>
					</div>
				))}
		</div>
	)

	return (
		<div className="flex flex-col flex-1 w-full min-w-0 gap-12">
			{/* Hero Section */}
			<div className="relative h-[400px] md:h-[500px] rounded-xl w-full overflow-hidden">
				{isLoadingHero ? (
					<div
						className="absolute inset-0 bg-gradient-to-r from-primary/20 to-muted flex items-center justify-center">
						<Skeleton className="w-full h-full" />
					</div>
				) : featuredMovie ? (
					<>
						<div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
						<img
							src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
							alt={featuredMovie.title}
							className="w-full h-full object-cover"
							onLoad={() => setIsLoadingHero(false)}
						/>
						<div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 max-w-3xl">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-3xl md:text-5xl font-bold text-white"
							>
								{featuredMovie.title}
							</motion.h1>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="text-white/90 mt-4 line-clamp-2 md:line-clamp-3"
							>
								{featuredMovie.overview}
							</motion.p>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="mt-6 flex gap-3"
							>
								<Button
									size="lg"
									onClick={() => {
										// Handle watch trailer click
										alert(`Watch trailer for ${featuredMovie.title}`)
									}}
								>Watch Trailer</Button>
								<Button size="lg" variant="secondary">
									More Info
								</Button>
							</motion.div>
						</div>
					</>
				) : (
					<div
						className="absolute inset-0 bg-gradient-to-r from-primary/20 to-muted flex flex-col items-center justify-center p-8 text-center">
						<h2 className="text-2xl font-bold text-white mb-4">Welcome to Movie Explorer</h2>
						<p className="text-white/80 mb-6">
							Discover amazing movies and create your watchlist
						</p>
						<Button size="lg">Browse Movies</Button>
					</div>
				)}
			</div>

			{/* Welcome Section */}
			<Card className="bg-muted/50 w-full overflow-hidden">
				<CardContent className="p-6">
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h2 className="text-2xl font-bold mb-4">Welcome to MovieHub</h2>
							<p className="text-muted-foreground">
								Discover the world of cinema with our curated collection of movies.
								Browse popular films, top-rated classics, current releases, and upcoming premieres.
								Create watch lists, rate movies, and share your favorites with friends.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Card className="bg-background">
								<CardHeader>
									<CardTitle className="text-lg">Personalized</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Recommendations tailored just for you
									</p>
								</CardContent>
							</Card>
							<Card className="bg-background">
								<CardHeader>
									<CardTitle className="text-lg">Updated Daily</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Fresh content added regularly
									</p>
								</CardContent>
							</Card>
							<Card className="bg-background">
								<CardHeader>
									<CardTitle className="text-lg">Any Device</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Access your watchlist anywhere
									</p>
								</CardContent>
							</Card>
							<Card className="bg-background">
								<CardHeader>
									<CardTitle className="text-lg">Community</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Share and discuss with movie lovers
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="w-full flex flex-col items-center justify-center gap-12">
				{/* Movie Category Carousels */}
				{Object.entries(loaderData.discover).map(([category, data]) => (
					<section key={category} className="w-full">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold">{categoryTitles[category]}</h2>
							<Button variant="ghost">View All</Button>
						</div>

						{isLoadingCarousels ? (
							<div className="px-4">
								{renderSkeletonCards(5)}
							</div>
						) : data.results.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								No movies found in this category
							</div>
						) : (
							<div className="grid grid-cols-1 w-full">
								<Carousel
									opts={{
										align: 'start',
										loop: true,
									}}
								>
									<CarouselContent className="ml-0"> {/* Removed negative margin */}
										{data.results.map((movie, index) => (
											<CarouselItem
												key={movie.id}
												className={`basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 ${index !== 0 ? 'pl-4' : ''}`}
											>
												<MovieCard movie={movie} genres={loaderData.genres} />
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
													  variant={'secondary'} />
									<CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
												  variant={'secondary'} />
								</Carousel>
							</div>
						)}
					</section>
				))}
			</div>


			{/* Call to Action - Added w-full overflow-hidden */}
			<Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 w-full overflow-hidden">
				<CardContent className="p-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold mb-4">
						Ready to explore more?
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto mb-6">
						Join our community of movie enthusiasts and get personalized recommendations,
						create watchlists, and never miss a new release.
					</p>
					<div className="flex gap-3 justify-center">
						<Button
							size="lg"
							asChild
						>
							<Link to="/discover">
								Get Started
							</Link>
						</Button>
						<Button
							size="lg"
							variant="secondary"
							asChild
						>
							<Link to="/filter">
								Browse Movies
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}