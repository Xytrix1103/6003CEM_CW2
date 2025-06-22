import { Form, useLoaderData, useNavigation, useSearchParams } from 'react-router'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	Checkbox,
	Input,
	Label,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
	Slider,
	Spinner,
} from '@/components/ui'
import { useEffect, useState } from 'react'
import type { DiscoverResponse } from '@/types/discover'
import type { Genre } from '@/types/genre'
import MovieCard from '@/components/custom/MovieCard'
import { Filter } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define filter schema for validation
const filterSchema = z.object({
	with_genres: z.string().optional(),
	primary_release_year: z.string().optional(),
	vote_average: z.object({
		gte: z.string().optional(),
		lte: z.string().optional(),
	}).optional(),
	with_runtime: z.string().optional(),
	sort_by: z.string().optional(),
	with_keywords: z.string().optional(),
})

export default function FilterPage() {
	const loaderData = useLoaderData() as {
		discover: DiscoverResponse
		genres: Genre[]
		appliedFilters: Record<string, string>
	}
	const navigation = useNavigation()
	const [searchParams, setSearchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState(loaderData.discover.page)
	const [isLoading, setIsLoading] = useState(false)
	const isSubmitting = navigation.state === 'submitting'

	// Initialize form with react-hook-form
	// Initialize form with react-hook-form
	const form = useForm<z.infer<typeof filterSchema>>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			with_genres: loaderData.appliedFilters.with_genres || '',
			primary_release_year: loaderData.appliedFilters.primary_release_year || '',
			vote_average: {
				gte: loaderData.appliedFilters['vote_average.gte'] || '',
				lte: loaderData.appliedFilters['vote_average.lte'] || '',
			},
			with_runtime: loaderData.appliedFilters.with_runtime || '',
			sort_by: loaderData.appliedFilters.sort_by || 'popularity.desc',
			with_keywords: loaderData.appliedFilters.with_keywords || '',
		},
	})

	// Reset form when loader data changes
	useEffect(() => {
		form.reset({
			with_genres: loaderData.appliedFilters.with_genres || '',
			primary_release_year: loaderData.appliedFilters.primary_release_year || '',
			vote_average: {
				gte: loaderData.appliedFilters['vote_average.gte'] || '',
				lte: loaderData.appliedFilters['vote_average.lte'] || '',
			},
			with_runtime: loaderData.appliedFilters.with_runtime || '',
			sort_by: loaderData.appliedFilters.sort_by || 'popularity.desc',
			with_keywords: loaderData.appliedFilters.with_keywords || '',
		})
	}, [form, loaderData.appliedFilters])

	useEffect(() => {
		setIsLoading(navigation.state === 'loading')
	}, [navigation.state])

	useEffect(() => {
		setCurrentPage(loaderData.discover.page)
	}, [loaderData.discover.page])

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
				<div className="col-div-full text-center py-12">
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

	const getSelectedGenreNames = () => {
		const selectedGenres = form.watch('with_genres') || ''
		if (!selectedGenres) return 'Any'
		return selectedGenres.split(',')
			.map(id => loaderData.genres.find(g => g.id === parseInt(id)))?.filter(Boolean)
			.map(genre => genre?.name)
			.join(', ') || 'Any'
	}

	// Update rating filter usage throughout the component
	const getRatingText = () => {
		const gte = form.watch('vote_average.gte') || ''
		const lte = form.watch('vote_average.lte') || ''
		return gte || lte ? `${gte || '0'} - ${lte || '10'}` : 'Any'
	}

	return (
		<div className="flex flex-col flex-1 w-full min-w-0">
			<div className="mb-8 text-left">
				<h1 className="text-4xl font-bold mb-2">Advanced Movie Filters</h1>
				<p className="text-lg text-muted-foreground">
					Find exactly what you're looking for with our powerful filters
				</p>
			</div>

			{/* Filter Form with react-router Form */}
			<Form
				method="get"
				action="/filter"
				className="flex flex-col lg:flex-row gap-8"
			>
				{/* Filters Sidebar */}
				<div className="lg:w-1/4 min-w-[280px]">
					<div className="bg-muted rounded-lg p-6 sticky top-4">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Filter className="h-5 w-5" /> Filters
							</h2>
							<Button
								variant="ghost"
								size="sm"
								type="button"
								onClick={() => {
									form.reset({
										with_genres: '',
										primary_release_year: '',
										vote_average: {
											gte: '',
											lte: '',
										},
										with_runtime: '',
										sort_by: 'popularity.desc',
										with_keywords: '',
									})
								}}
							>
								Reset
							</Button>
						</div>

						<Accordion type="multiple" defaultValue={['genres', 'rating', 'year']}>
							{/* Genre Filter */}
							<AccordionItem value="genres">
								<AccordionTrigger>
									<div className="flex flex-col items-start">
										<div>Genres</div>
										<div className="text-sm text-muted-foreground font-normal">
											{getSelectedGenreNames()}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
										{loaderData.genres.map(genre => (
											<div key={genre.id} className="flex items-center space-x-2">
												<Checkbox
													id={`genre-${genre.id}`}
													checked={(form.watch('with_genres') || '').split(',').includes(genre.id.toString())}
													onCheckedChange={(checked) => {
														const currentGenres = (form.watch('with_genres') || '').split(',').filter(Boolean)
														let newGenres

														if (checked) {
															newGenres = [...currentGenres, genre.id.toString()]
														} else {
															newGenres = currentGenres.filter(id => id !== genre.id.toString())
														}

														form.setValue('with_genres', newGenres.join(','))
													}}
												/>
												<label
													htmlFor={`genre-${genre.id}`}
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
												>
													{genre.name}
												</label>
											</div>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Year Filter */}
							<AccordionItem value="year">
								<AccordionTrigger>
									<div className="flex flex-col items-start">
										<div>Release Year</div>
										<div className="text-sm text-muted-foreground font-normal">
											{form.watch('primary_release_year') || 'Any'}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Input
										type="number"
										min="1900"
										max={new Date().getFullYear()}
										placeholder="Year (e.g., 2023)"
										{...form.register('primary_release_year')}
									/>
								</AccordionContent>
							</AccordionItem>

							{/* Rating Filter */}
							<AccordionItem value="rating">
								<AccordionTrigger>
									<div className="flex flex-col items-start">
										<div>Rating</div>
										<div className="text-sm text-muted-foreground font-normal">
											{getRatingText()}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<Label htmlFor="min-rating">Min Rating</Label>
											<div className="text-sm text-muted-foreground">
												{form.watch('vote_average.gte') || '0'}
											</div>
										</div>
										<Slider
											id="min-rating"
											min={0}
											max={10}
											step={0.5}
											value={[parseFloat(form.watch('vote_average.gte') || '0')]}
											onValueChange={(value) => form.setValue('vote_average.gte', value[0].toString())}
										/>

										<div className="flex items-center justify-between">
											<Label htmlFor="max-rating">Max Rating</Label>
											<div className="text-sm text-muted-foreground">
												{form.watch('vote_average.lte') || '10'}
											</div>
										</div>
										<Slider
											id="max-rating"
											min={0}
											max={10}
											step={0.5}
											value={[parseFloat(form.watch('vote_average.lte') || '10')]}
											onValueChange={(value) => form.setValue('vote_average.lte', value[0].toString())}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>

							{/* Runtime Filter */}
							<AccordionItem value="runtime">
								<AccordionTrigger>
									<div className="flex flex-col items-start">
										<div>Runtime</div>
										<div className="text-sm text-muted-foreground font-normal">
											{form.watch('with_runtime') ? `${form.watch('with_runtime')} mins` : 'Any'}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Input
										type="number"
										min="0"
										placeholder="Max runtime in minutes"
										{...form.register('with_runtime')}
									/>
								</AccordionContent>
							</AccordionItem>

							{/* Sort By */}
							<AccordionItem value="sort">
								<AccordionTrigger>
									<div className="flex flex-col items-start">
										<div>Sort By</div>
										<div className="text-sm text-muted-foreground font-normal">
											{form.watch('sort_by') === 'popularity.desc' ? 'Popularity' :
												form.watch('sort_by') === 'vote_average.desc' ? 'Rating' :
													form.watch('sort_by') === 'primary_release_date.desc' ? 'Release Date' :
														'Revenue'}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Select
										value={form.watch('sort_by')}
										onValueChange={(value) => form.setValue('sort_by', value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sort by" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="popularity.desc">Popularity</SelectItem>
											<SelectItem value="vote_average.desc">Rating</SelectItem>
											<SelectItem value="primary_release_date.desc">Release Date</SelectItem>
											<SelectItem value="revenue.desc">Revenue</SelectItem>
										</SelectContent>
									</Select>
								</AccordionContent>
							</AccordionItem>

							{/* Keywords */}
							<AccordionItem value="keywords">
								<AccordionTrigger>
									<div className="flex flex-col items-start">
										<div>Keywords</div>
										<div className="text-sm text-muted-foreground font-normal">
											{form.watch('with_keywords') ? 'Keywords applied' : 'None'}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Input
										placeholder="Search keywords..."
										{...form.register('with_keywords')}
									/>
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<Button
							className="w-full mt-6"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? <Spinner className="mr-2" /> : null}
							Apply Filters
						</Button>
					</div>
				</div>

				{/* Results Section */}
				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold">
							{loaderData.discover.total_results} Movies Found
						</h2>
						<div className="text-sm text-muted-foreground">
							Page {currentPage} of {loaderData.discover.total_pages}
						</div>
					</div>

					<div
						className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 min-w-0">
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

				{/* Hidden fields for form submission */}
				<input type="hidden" name="with_genres" value={form.watch('with_genres') || ''} />
				<input type="hidden" name="primary_release_year" value={form.watch('primary_release_year') || ''} />
				<input type="hidden" name="vote_average.gte" value={form.watch('vote_average.gte') || ''} />
				<input type="hidden" name="vote_average.lte" value={form.watch('vote_average.lte') || ''} />
				<input type="hidden" name="with_runtime" value={form.watch('with_runtime') || ''} />
				<input type="hidden" name="sort_by" value={form.watch('sort_by') || ''} />
				<input type="hidden" name="with_keywords" value={form.watch('with_keywords') || ''} />
			</Form>
		</div>
	)
}