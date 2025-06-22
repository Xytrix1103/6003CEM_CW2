export const tmdbImage = (path: string | null, size: string = 'original') => {
	if (!path) return ''
	return `https://image.tmdb.org/t/p/${size}${path}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
}