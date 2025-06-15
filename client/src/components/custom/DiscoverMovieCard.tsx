// src/components/MovieCard.tsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Languages, PlayCircle, Star } from 'lucide-react'
import { tmdbImage } from '@/components/utils'
import type { DiscoverResponseResult } from '@/types/discover'
import type { Genre } from '@/types/genre'

interface MovieCardProps {
	movie: DiscoverResponseResult;
	genres: Genre[];
}

const MovieCard = ({ movie, genres }: MovieCardProps) => {
	const [isLoaded, setIsLoaded] = useState(false)
	const [showFallback, setShowFallback] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)

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

	return (
		<div
			className="group relative min-w-0 w-full"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Link to={`/movie/${movie.id}`} className="block w-full">
				<div className="aspect-[2/3] rounded-lg bg-muted overflow-hidden relative">
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

					{/* Hover Overlay */}
					{isHovered && (
						<div
							className="absolute inset-0 bg-black opacity-90 p-4 flex flex-col justify-between transition-opacity duration-300">
							<div>
								<h3 className="font-bold text-lg text-white line-clamp-2">{movie.title}</h3>

								<div className="flex flex-wrap gap-2 mt-2">
									{movie.genre_ids && movie.genre_ids.length > 0 ? (
										movie.genre_ids.slice(0, 3).map((id) => {
											const genre = genres.find((g) => g.id === id)
											return (
												<div
													key={id}
													className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs"
												>
													{genre ? genre.name : 'Unknown'}
												</div>
											)
										})
									) : (
										<div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
											No Genres
										</div>
									)}
								</div>

								{movie.overview && (
									<p className="text-sm text-gray-300 mt-3 line-clamp-4">
										{movie.overview}
									</p>
								)}
							</div>

							<div className="grid grid-cols-2 gap-2 mt-auto">
								<div className="flex items-center text-sm text-white gap-2">
									<Calendar size="16" />
									<div>{movie.release_date ? formatDate(movie.release_date) : 'N/A'}</div>
								</div>

								{movie.original_language && (
									<div className="flex items-center text-sm text-white gap-2">
										<Languages size="16" />
										<div>
											{movie.original_language.toUpperCase()}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Always visible play icon on hover */}
					{isHovered && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<PlayCircle className="h-16 w-16 text-white opacity-80" />
						</div>
					)}
				</div>
			</Link>

			{/* Info below poster (always visible) */}
			<div className="mt-3 min-w-0">
				<h3 className="font-semibold truncate group-hover:text-primary transition-colors min-w-0">
					{movie.title}
				</h3>
				<div className="flex justify-between items-center mt-1 text-sm text-muted-foreground min-w-0">
					<div className="flex items-center min-w-0">
						<Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
						<span
							className="truncate min-w-0">{movie.release_date ? formatDate(movie.release_date) : 'N/A'}</span>
					</div>
					<div
						className="flex items-center bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md text-xs flex-shrink-0">
						<Star className="h-3 w-3 mr-1" />
						<span>{movie.vote_average.toFixed(1)}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MovieCard