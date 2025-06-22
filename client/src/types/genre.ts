type GenreResponse = {
	genres: Genre[];
}

type Genre = {
	id: number;
	name: string;
}

export type { GenreResponse, Genre }