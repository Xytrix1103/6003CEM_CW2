// src/components/MovieCard.tsx
import { type MouseEvent, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Bookmark, Calendar, Heart, Info, Languages, PlayCircle, Star } from 'lucide-react'
import { tmdbImage } from '@/components/utils'
import type { DiscoverResponseResult } from '@/types/discover'
import type { Genre } from '@/types/genre'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ProfileContext } from '@/components/contexts'
import type { MovieDetailsResponse } from '@/types/movie'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui'

interface MovieCardProps {
	movie: DiscoverResponseResult | MovieDetailsResponse
	genres?: Genre[];
	viewOnly?: boolean; // Optional prop to indicate read-only mode
}

const MovieCard = ({ movie, genres, viewOnly = false }: MovieCardProps) => {
	const [isLoaded, setIsLoaded] = useState(false)
	const [showFallback, setShowFallback] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const [showDetails, setShowDetails] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)

	// Alert dialog states
	const [showRemoveWatchlistDialog, setShowRemoveWatchlistDialog] = useState(false)
	const [showRemoveFavoriteDialog, setShowRemoveFavoriteDialog] = useState(false)

	const { profile, addToWatchlist, removeFromWatchlist, favoriteMovie, unfavoriteMovie } = useContext(ProfileContext)

	// Determine bookmark and favorite status
	const isBookmarked = profile?.watchlist?.includes(movie.id) ?? false
	const isFavorited = profile?.watched?.some(
		w => w.movieId === movie.id && w.isFavorited,
	) ?? false

	useEffect(() => {
		if (imgRef.current?.complete) {
			setIsLoaded(true)
		}
	}, [])

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	// Handle watchlist actions
	const handleAddToWatchlist = async (e: MouseEvent) => {
		e.preventDefault()
		await addToWatchlist(movie.id)
	}

	const handleRemoveFromWatchlist = async (e: MouseEvent) => {
		e.preventDefault()
		await removeFromWatchlist(movie.id)
			.then(() => {
				setShowRemoveWatchlistDialog(false)
			})
	}

	// Handle favorite actions
	const handleAddToFavorites = async (e: MouseEvent) => {
		e.preventDefault()
		await favoriteMovie(movie.id)
	}

	const handleRemoveFromFavorites = async (e: MouseEvent) => {
		e.preventDefault()
		await unfavoriteMovie(movie.id)
			.then(() => {
				setShowRemoveFavoriteDialog(false)
			})
	}

	// Toggle details view
	const toggleDetails = (e: MouseEvent) => {
		e.preventDefault()
		setShowDetails(!showDetails)
	}

	// Render genres based on movie type
	const renderGenres = () => {
		if ('genre_ids' in movie && movie.genre_ids.length > 0) {
			// This is a DiscoverResponseResult with genre_ids
			return movie.genre_ids.slice(0, 3).map((id) => {
				const genre = genres?.find((g) => g.id === id)
				return (
					<div
						key={id}
						className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs"
					>
						{genre ? genre.name : 'Unknown'}
					</div>
				)
			})
		} else if ('genres' in movie && movie.genres.length > 0) {
			// This is a MovieDetailsResponse with genres
			return movie.genres.slice(0, 3).map((genre) => (
				<div
					key={genre.id}
					className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs"
				>
					{genre.name}
				</div>
			))
		} else {
			return (
				<div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
					No Genres
				</div>
			)
		}
	}

	return (
		<div
			className="group relative min-w-0 w-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Remove from Watchlist Dialog */}
			<AlertDialog open={showRemoveWatchlistDialog} onOpenChange={setShowRemoveWatchlistDialog}>
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
							Are you sure you want to remove "{movie.title}" from your favorites?
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
			<Link to={`/movie/${movie.id}`} className="block w-full">
				<div className="aspect-[2/3] rounded-lg bg-muted overflow-hidden relative">
					{/* Action buttons at top right */}
					<div className="absolute top-2 right-2 z-30 flex gap-1">
						<TooltipProvider>
							{/* Watchlist button */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="icon"
										className={`h-8 w-8 bg-background/80 hover:bg-background text-foreground ${viewOnly ? 'cursor-default' : ''}`}
										onClick={isBookmarked ? (e) => {
											e.preventDefault()
											setShowRemoveWatchlistDialog(true)
										} : handleAddToWatchlist}
										aria-disabled={viewOnly}
									>
										<Bookmark
											className={`h-4 w-4 ${isBookmarked ? 'fill-primary stroke-primary' : ''}`}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{
										viewOnly ?
											isBookmarked ? 'In watchlist' : 'Not in watchlist'
											:
											isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'
									}
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="icon"
										className={`h-8 w-8 bg-background/80 hover:bg-background text-foreground ${viewOnly ? 'cursor-default' : ''}`}
										onClick={isFavorited ? (e) => {
											e.preventDefault()
											setShowRemoveFavoriteDialog(true)
										} : handleAddToFavorites}
										aria-disabled={viewOnly}
									>
										<Heart
											className={`h-4 w-4 ${isFavorited ? 'fill-destructive stroke-destructive' : ''}`}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{viewOnly
										? isFavorited ? 'In favorites' : 'Not in favorites'
										: isFavorited ? 'Remove from favorites' : 'Add to favorites'}
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="icon"
										className={`h-8 w-8 ${
											showDetails
												? 'bg-primary/80 hover:bg-primary text-primary-foreground'
												: 'bg-background/80 hover:bg-background text-foreground'
										}`}
										onClick={toggleDetails}
									>
										<Info
											className={`h-4 w-4 ${showDetails ? 'text-primary-foreground' : ''}`}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{showDetails ? 'Hide details' : 'Show details'}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					{movie.poster_path && !showFallback ? (
						<>
							{!isLoaded && (
								<div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
							)}
							<img
								ref={imgRef}
								src={tmdbImage(movie.poster_path, 'w500')}
								alt={movie.title}
								className={`w-full h-full object-cover transition-all duration-300 ${
									isLoaded ? 'opacity-100' : 'opacity-0'
								} ${isHovered ? 'scale-110' : ''}`}
								loading="lazy"
								onLoad={() => setIsLoaded(true)}
								onError={() => setShowFallback(true)}
							/>
						</>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-gray-800">
							<PlayCircle className="h-12 w-12 text-gray-400" />
						</div>
					)}

					{/* Details Overlay - now with top padding to avoid button overlap */}
					{showDetails && (
						<div
							className="absolute inset-0 bg-black/90 p-4 pt-12 flex flex-col justify-between transition-opacity duration-300 z-20">
							<div>
								{/* Moved content down with pt-12 */}
								<h3 className="font-bold text-lg text-white line-clamp-2">{movie.title}</h3>

								<div className="flex flex-wrap gap-2 mt-2">
									{renderGenres()}
								</div>

								{movie.overview && (
									<p className="text-sm text-gray-300 mt-3 line-clamp-4">
										{movie.overview}
									</p>
								)}
							</div>

							<div className="grid grid-cols-2 gap-2 mt-auto">
								<div className="flex items-center text-xs text-white gap-2">
									<Calendar size="16" />
									<div>{movie.release_date ? formatDate(movie.release_date) : 'N/A'}</div>
								</div>

								{movie.original_language && (
									<div className="flex items-center text-xs text-white gap-2">
										<Languages size="16" />
										<div>
											{movie.original_language.toUpperCase()}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</Link>

			{/* Info below poster (always visible) */}
			<div className="mt-3 min-w-0">
				<Link to={`/movie/${movie.id}`}>
					<h3 className="font-semibold truncate group-hover:text-primary transition-colors min-w-0">
						{movie.title}
					</h3>
				</Link>
				<div className="flex justify-between items-center mt-1 text-sm text-muted-foreground min-w-0">
					<div className="flex items-center min-w-0">
						<Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
						<div
							className="truncate min-w-0">{movie.release_date ? formatDate(movie.release_date) : 'N/A'}</div>
					</div>
					<div
						className="flex items-center bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md text-xs flex-shrink-0">
						<Star className="h-3 w-3 mr-1" />
						<div>{movie.vote_average.toFixed(1)}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MovieCard