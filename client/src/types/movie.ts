export interface MovieDetailsResponse {
	id: number;
	title: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	runtime: number;
	vote_average: number;
	vote_count: number;
	genres: {
		id: number;
		name: string;
	}[];
	production_companies: {
		id: number;
		name: string;
		logo_path: string | null;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
	budget: number;
	revenue: number;
	original_language: string;
	original_title: string;
	imdb_id: string | null;
	homepage: string | null;
	adult: boolean;
	popularity: number;
	// Appended responses
	videos: {
		results: Video[];
	};
	credits: {
		cast: Cast[];
		crew: Crew[];
	};
	reviews: {
		results: Review[];
		page: number;
		total_pages: number;
		total_results: number;
	};
	images: {
		backdrops: Image[];
		posters: Image[];
		logos: Image[];
	};
	external_ids: ExternalIds;
	// Add similar movies attribute
	similar: {
		page: number;
		results: SimilarMovie[];
		total_pages: number;
		total_results: number;
	};
	omdb?: OMDB; // Optional OMDB data
}

export type OmdbRating = {
	Source: string;
	Value: string;
};

export type OMDB = {
	Title: string;
	Year: string;
	Rated: string;
	Released: string;
	Runtime: string;
	Genre: string;
	Director: string;
	Writer: string;
	Actors: string;
	Plot: string;
	Language: string;
	Country: string;
	Awards: string;
	Poster: string;
	Ratings: OmdbRating[];
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	imdbID: string;
	Type: string;
	DVD: string;
	BoxOffice: string;
	Production: string;
	Website: string;
	Response: string;
};

// Sub-types
export interface Video {
	id: string;
	key: string;
	name: string;
	site: string; // Usually "YouTube"
	size: number; // 360, 480, 720, 1080
	type: string; // "Trailer", "Teaser", "Clip", etc.
	official: boolean;
}

export interface Cast {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
	credit_id: string;
}

export interface Crew {
	id: number;
	name: string;
	job: string; // "Director", "Producer", etc.
	profile_path: string | null;
	department: string;
	credit_id: string;
}

export interface Review {
	id: string;
	author: string;
	author_details: {
		name: string;
		username: string;
		avatar_path: string | null;
		rating: number | null;
	};
	content: string;
	created_at: string;
	url: string;
}

export interface Image {
	aspect_ratio: number;
	height: number;
	width: number;
	file_path: string;
	vote_average: number;
	vote_count: number;
	iso_639_1: string | null;
}

export interface ExternalIds {
	imdb_id: string | null;
	facebook_id: string | null;
	instagram_id: string | null;
	twitter_id: string | null;
	wikidata_id: string | null;
}

// Add SimilarMovie interface
export interface SimilarMovie {
	id: number;
	title: string;
	poster_path: string | null;
	backdrop_path: string | null;
	release_date: string;
	vote_average: number;
	genre_ids: number[];
	overview: string;
	adult: boolean;
	original_language: string;
	original_title: string;
	popularity: number;
	video: boolean;
	vote_count: number;
}