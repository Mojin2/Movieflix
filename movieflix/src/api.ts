const API_KEY = "a6b27739090baab4876f21c971f0ceaa";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovie {
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  id: number;
}
export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

const PATH =
  "https://api.themoviedb.org/3/search/movie?api_key=api_key&language=en-US&query=hello&page=1&include_adult=false";
