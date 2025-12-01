import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "multi"; // multi, movie, tv

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Map our types to TMDB endpoints
    let endpoint = "search/multi";
    if (type === "Film") {
      endpoint = "search/movie";
    } else if (type === "Series" || type === "Anime" || type === "Donghua") {
      endpoint = "search/tv";
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("TMDB API error");
    }

    const data = await response.json();

    interface TMDBSearchResult {
      id: number;
      title?: string;
      name?: string;
      original_title?: string;
      original_name?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path?: string;
      backdrop_path?: string;
      overview?: string;
      vote_average?: number;
      media_type?: string;
      genre_ids?: number[];
    }

    // Transform results to our format
    const results = data.results
      .filter((item: TMDBSearchResult) => item.media_type !== "person")
      .slice(0, 10)
      .map((item: TMDBSearchResult) => ({
        id: item.id,
        title: item.title || item.name,
        originalTitle: item.original_title || item.original_name,
        year: (item.release_date || item.first_air_date || "").split("-")[0],
        posterUrl: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null,
        backdropUrl: item.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
          : null,
        overview: item.overview,
        rating: item.vote_average
          ? Math.round(item.vote_average * 10) / 10
          : null,
        mediaType:
          item.media_type || (endpoint.includes("movie") ? "movie" : "tv"),
        genreIds: item.genre_ids || [],
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json(
      { error: "Failed to search TMDB" },
      { status: 500 }
    );
  }
}
