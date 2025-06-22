import { Form, useLoaderData, useNavigation, useSearchParams } from 'react-router'
import {
	Button,
	Input,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Skeleton,
} from '@/components/ui'
import { useEffect, useState } from 'react'
import type { DiscoverResponse } from '@/types/discover'
import MovieCard from '@/components/custom/MovieCard'
import { Search } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Genre } from '@/types/genre'

// Define form schema for validation
const searchSchema = z.object({
	query: z.string().min(1, 'Search query is required'),
})

export default function SearchPage() {
	const loaderData = useLoaderData() as {
		discover: DiscoverResponse
		query: string
		genres: Genre[]
	}
	const navigation = useNavigation()
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState(loaderData.discover.page)
	const [isLoading, setIsLoading] = useState(false)
	const isSubmitting = navigation.state === 'submitting'

	// Initialize form with react-hook-form
	const form = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			query: loaderData.query || '',
		},
	})

	useEffect(() => {
		setIsLoading(navigation.state === 'loading')
	}, [navigation.state])

	useEffect(() => {
		setCurrentPage(loaderData.discover.page)
		form.reset({ query: loaderData.query })
	}, [form, loaderData.discover.page, loaderData.query])

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams)
		params.set('page', page.toString())
		setSearchParams(params)
	}

	const renderPaginationItems = () => {
		const items = []
		const totalPages = loaderData.discover.total_pages
		const current = currentPage
		const delta = 2

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
					<Button
						onClick={() => handlePageChange(1)}
						className="mt-4"
					>
						Refresh
					</Button>
				</div>
			)
		}

		return loaderData.discover.results.map((movie) => (
			<MovieCard key={movie.id} movie={movie} genres={loaderData.genres} />
		))
	}

	return (
		<div className="flex flex-col flex-1 w-full min-w-0 gap-6">
			<div className="text-left">
				<h1 className="text-4xl font-bold mb-2">Search Movies</h1>
				<p className="text-lg text-muted-foreground">
					Find movies by title, cast, director, or keywords
				</p>
			</div>

			{/* Search Form with react-router Form */}
			<Form
				method="get"
				action="/search"
				className="w-full mx-auto flex flex-col gap-2"
			>
				<div className="flex items-stretch w-full overflow-hidden border rounded-md">
					<Input
						type="search"
						placeholder="Search for movies, actors, directors..."
						className="border-0 rounded-none shadow-none flex-1 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
						{...form.register('query')}
					/>
					<Button
						type="submit"
						size="lg"
						className="rounded-l-none h-auto"
						disabled={isSubmitting}
					>
						{isSubmitting ? <Spinner className="mr-2" /> :
							<Search className="h-6 w-6 text-background" />}
					</Button>
				</div>
				{form.formState.errors.query && (
					<p className="mt-2 text-sm text-destructive">
						{form.formState.errors.query.message}
					</p>
				)}
			</Form>

			{/* Results */}
			{loaderData.query ? (
				<div className="flex flex-col gap-8">
					<div className="flex flex-row justify-between items-center">
						<h2 className="text-xl font-bold">
							{loaderData.discover.total_results} results for "{loaderData.query}"
						</h2>
						<p className="text-muted-foreground">
							Page {currentPage} of {loaderData.discover.total_pages}
						</p>
					</div>
					<div
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 min-w-0">
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
			) : (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div
						className="bg-muted border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center mb-6">
						<Search className="h-12 w-12 text-muted-foreground" />
					</div>
					<h2 className="text-2xl font-bold mb-2">Start Your Search</h2>
					<p className="text-muted-foreground max-w-md">
						Enter a movie title, actor, director, or keyword in the search bar above to find movies
					</p>
				</div>
			)}
		</div>
	)
}