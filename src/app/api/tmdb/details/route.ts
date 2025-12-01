import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// TMDB genre ID to name mapping
const movieGenres: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const tvGenres: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const mediaType = searchParams.get("type") || "movie"; // movie or tv

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error("TMDB API error");
    }

    const item = await response.json();

    interface TMDBGenre {
      id: number;
      name: string;
    }

    // Get genre names
    const genreMap = mediaType === "movie" ? movieGenres : tvGenres;
    const genres =
      item.genres?.map((g: TMDBGenre) => genreMap[g.id] || g.name).join(", ") ||
      "";

    // Transform to our format
    const result = {
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
      genres,
      totalEpisodes: item.number_of_episodes || null,
      totalSeasons: item.number_of_seasons || null,
      runtime: item.runtime || item.episode_run_time?.[0] || null,
      status: item.status,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("TMDB details error:", error);
    return NextResponse.json(
      { error: "Failed to get details from TMDB" },
      { status: 500 }
    );
  }
}
