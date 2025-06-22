// src/pages/Discover.tsx
import { useLoaderData, useNavigation, useSearchParams } from 'react-router'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Skeleton,
	Tabs,
	TabsList,
	TabsTrigger,
} from '@/components/ui'
import { useEffect, useState } from 'react'
import type { DiscoverResponse } from '@/types/discover'
import type { Genre } from '@/types/genre'
import MovieCard from '@/components/custom/MovieCard'

export default function DiscoverPage() {
	const loaderData = useLoaderData() as {
		discover: DiscoverResponse
		genres: Genre[]
	}
	const navigation = useNavigation()
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState(loaderData.discover.page)
	const currentCategory = searchParams.get('category') || 'popular'
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		setIsLoading(navigation.state === 'loading')
	}, [navigation.state])

	useEffect(() => {
		setCurrentPage(loaderData.discover.page)
	}, [loaderData.discover.page])

	const handleTabChange = (category: string) => {
		const params = new URLSearchParams()
		params.set('category', category)
		setSearchParams(params)
	}

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		setSearchParams(params)
	}

	// Generate pagination items
	const renderPaginationItems = () => {
		const items = []
		const totalPages = loaderData.discover.total_pages
		const current = currentPage
		const delta = 2 // Number of pages to show around current

		// Previous button
		items.push(
			<PaginationItem key="prev">
				<PaginationPrevious
					className={currentPage <= 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
					onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
				/>
			</PaginationItem>,
		)

		// First page
		if (current > delta + 1) {
			items.push(
				<PaginationItem key={1}>
					<PaginationLink
						isActive={1 === currentPage}
						onClick={() => handlePageChange(1)}
						className="cursor-pointer"
					>
						1
					</PaginationLink>
				</PaginationItem>,
			)
		}

		// Ellipsis before current
		if (current > delta + 2) {
			items.push(
				<PaginationItem key="ellipsis-start">
					<PaginationEllipsis />
				</PaginationItem>,
			)
		}

		// Middle pages
		for (let page = Math.max(1, current - delta); page <= Math.min(totalPages, current + delta); page++) {
			items.push(
				<PaginationItem key={page}>
					<PaginationLink
						isActive={page === currentPage}
						onClick={() => handlePageChange(page)}
						className="cursor-pointer"
					>
						{page}
					</PaginationLink>
				</PaginationItem>,
			)
		}

		// Ellipsis after current
		if (current < totalPages - delta - 1) {
			items.push(
				<PaginationItem key="ellipsis-end">
					<PaginationEllipsis />
				</PaginationItem>,
			)
		}

		// Last page
		if (current < totalPages - delta) {
			items.push(
				<PaginationItem key={totalPages}>
					<PaginationLink
						isActive={totalPages === currentPage}
						onClick={() => handlePageChange(totalPages)}
						className="cursor-pointer"
					>
						{totalPages}
					</PaginationLink>
				</PaginationItem>,
			)
		}

		// Next button
		items.push(
			<PaginationItem key="next">
				<PaginationNext
					className={currentPage >= totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
					onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
				/>
			</PaginationItem>,
		)

		return items
	}

	// Render movie cards
	const renderMovieCards = () => {
		if (isLoading) {
			return Array(20).fill(0).map((_, i) => (
				<div key={i} className="h-full overflow-hidden">
					<div className="aspect-[2/3] rounded-lg bg-muted relative">
						<Skeleton className="w-full h-full rounded-lg" />
					</div>
					<div className="mt-3 space-y-2">
						<Skeleton className="h-5 w-4/5" />
						<Skeleton className="h-4 w-1/3" />
					</div>
				</div>
			))
		}

		if (!loaderData.discover.results.length) {
			return (
				<div className="col-span-full text-center py-12">
					<div className="text-xl font-semibold">No movies found</div>
					<button
						onClick={() => handlePageChange(1)}
						className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
					>
						Refresh
					</button>
				</div>
			)
		}

		return loaderData.discover.results.map((movie) => (
			<MovieCard key={movie.id} movie={movie} genres={loaderData.genres} />
		))
	}

	return (
		<div className="flex flex-col flex-1 w-full min-w-0">
			<div className="flex flex-row align-middle justify-between items-center">
				<div className="mb-8 text-left">
					<h1 className="text-4xl font-bold mb-2">Discover Movies</h1>
					<p className="text-lg text-muted-foreground">
						Browse popular, top rated, and upcoming movies
					</p>
				</div>
				<Tabs
					value={currentCategory}
					onValueChange={handleTabChange}
					className="mb-6"
				>
					<TabsList className="grid grid-cols-4 min-w-0">
						<TabsTrigger value="popular">Popular</TabsTrigger>
						<TabsTrigger value="now_playing">Now Playing</TabsTrigger>
						<TabsTrigger value="top_rated">Top Rated</TabsTrigger>
						<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 min-w-0">
				{renderMovieCards()}
			</div>

			{loaderData.discover.total_pages > 1 && (
				<Pagination className="mt-8 min-w-0">
					<PaginationContent>
						{renderPaginationItems()}
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}