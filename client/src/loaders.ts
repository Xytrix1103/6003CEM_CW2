import type { DiscoverResponse } from '@/types/discover'
import type { Params } from 'react-router'
import type { MovieDetailsResponse } from '@/types/movie'
import { get } from '@/api'
import { auth } from '@/firebase'
import type { GenreResponse } from '@/types/genre'
import type { Profile } from '@/types/profile'
import { toast } from 'sonner'


export async function filterLoader({ request }: { request: Request }) {
	const url = new URL(request.url)
	await auth.authStateReady()

	// Extract filter parameters from URL
	const params = Object.fromEntries(url.searchParams.entries())

	// Map flat params to nested structure
	const apiParams = {
		...params,
		...(params['vote_average.gte'] || params['vote_average.lte'] ? {
			vote_average: {
				gte: params['vote_average.gte'],
				lte: params['vote_average.lte'],
			},
		} : {}),
	}

	let isError = false

	const genres = await get<GenreResponse>('/genre/movie/list')
		.catch(() => {
			isError = true
			return ({ genres: [] })
		})

	const filterResponse = await get<DiscoverResponse>('/movie/discover', apiParams)
		.catch(() => {
			isError = true
			return { results: [], page: 1, total_pages: 0, total_results: 0 }
		})

	if (isError) {
		toast.error('Something went wrong', {
			description: 'Unable to load movies. Please try again later.',
		})
	}

	return {
		discover: filterResponse,
		genres: genres.genres,
		appliedFilters: params,
	}
}


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

export async function discoverLoader({ request }: { request: Request }) {
	const url = new URL(request.url)
	const category = url.searchParams.get('category') || 'popular'
	const page = url.searchParams.get('page') || '1'
	await auth.authStateReady()

	let isError = false

	const genres = await get<GenreResponse>('/genre/movie/list')
		.catch(() => {
			isError = true
			return ({ genres: [] })
		})

	const discoverResponse = await get<DiscoverResponse>(`/movie/${category}`, {
		page,
	})
		.catch(() => {
			isError = true
			return { results: [], page: 1, total_pages: 0, total_results: 0 }
		})

	if (isError) {
		toast.error('Something went wrong', {
			description: 'Unable to load movies. Please try again later.',
		})
	}

	return {
		discover: discoverResponse,
		genres: genres.genres,
	}
}

export async function searchLoader({ request }: { request: Request }) {
	const url = new URL(request.url)
	const query = url.searchParams.get('query') || ''
	const page = url.searchParams.get('page') || '1'
	await auth.authStateReady()

	let isError = false

	const searchResponse = await get<DiscoverResponse>('/movie/search', {
		query,
		page,
	}).catch(() => {
		isError = true
		return { results: [], page: 1, total_pages: 0, total_results: 0 }
	})

	const genres = await get<GenreResponse>('/genre/movie/list')
		.catch(() => {
			isError = true
			return ({ genres: [] })
		})

	if (isError) {
		toast.error('Something went wrong', {
			description: 'Unable to load search results. Please try again later.',
		})
	}

	return {
		discover: searchResponse,
		query,
		genres: genres.genres,
	}
}

export async function homeLoader() {
	await auth.authStateReady()

	let isError = false

	const genres = await get<GenreResponse>('/genre/movie/list').catch(() => {
		isError = true
		return { genres: [] }
	})

	const categories = [
		{ name: 'popular', endpoint: '/movie/popular' },
		{ name: 'now_playing', endpoint: '/movie/now_playing' },
		{ name: 'top_rated', endpoint: '/movie/top_rated' },
		{ name: 'upcoming', endpoint: '/movie/upcoming' },
	]

	return await Promise.all(
		categories.map(async category =>
			await get<DiscoverResponse>(category.endpoint, {
				page: 1,
			})
				.then(response => ({
					...response,
					results: response.results.slice(0, 10), // Limit to top 10 results
				}))
				.catch(() => {
					isError = true
					return { results: [], page: 1, total_pages: 0, total_results: 0 }
				}),
		),
	)
		.then(responses => {
			if (isError) {
				console.error('Error loading home data')

				setTimeout(() => {
					toast.error('Something went wrong', {
						description: 'Unable to load movies. Please try again later.',
					})
				}, 0)
			}

			const discover = Object.fromEntries(
				categories.map((cat, index) => [cat.name, responses[index]]),
			)
			return { discover, genres: genres.genres }
		})
		.catch(() => ({
			discover: {
				popular: { results: [], page: 1, total_pages: 0, total_results: 0 },
				now_playing: { results: [], page: 1, total_pages: 0, total_results: 0 },
				top_rated: { results: [], page: 1, total_pages: 0, total_results: 0 },
				upcoming: { results: [], page: 1, total_pages: 0, total_results: 0 },
			},
			genres: [],
		}))
}


// get uid from params and get user profile
export async function userProfileLoader({ params }: { params: Params }) {
	await auth.authStateReady()
	const { uid } = params
	if (!uid) return null

	return await get<Profile>(`/user/uid/${uid}`)
		.catch(() => {
			toast.error('User not found', {
				description: 'The user you are looking for does not exist or has not registered.',
			})

			return {
				_id: '',
				firebaseUid: uid,
				email: '',
				displayName: 'User Not Found',
				watchlist: [],
				watched: [],
				movies: [],
			}
		})
}