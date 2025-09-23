const genreMap = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  "science fiction": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

const idToGenre = Object.fromEntries(
  Object.entries(genreMap).map(([name, id]) => [id, name])
);


export const parseArgs = (args) => {
  const params = {};
  args.split(" ").forEach((arg) => {
    const match = arg.match(/(\w+)=(.+)/);
    if (match) {
      let [, key, value] = match;
      if (key === "genre") value = genreMap[value.toLowerCase()] || value;
      params[key] = value;
    }
  });
  return params;
};

// Random media
export const fetchRandomDynamic = async (args) => {
  try {
    const params = parseArgs(args);
    if (!params.type) params.type = "movie";

    const res = await fetch(
      `https://movierando-springboot-2.onrender.com/media/random?${new URLSearchParams(
        params
      )}`
    );
    if (!res.ok) return { error: "No media found ❌" };
    const data = await res.json();
    return data;
  } catch {
    return { error: "Error fetching random media ❌" };
  }
};

export const searchMediaDynamic = async (args, page = 1) => {
  try {
    const params = parseArgs(args);
    if (!params.type) params.type = "movie";
    params.page = page;

    const res = await fetch(
      `https://movierando-springboot-2.onrender.com/media/search?${new URLSearchParams(
        params
      )}`
    );
    if (!res.ok) return { error: "No search results ❌" };
    const data = await res.json();

    const items = (data.results || []).map((m) => ({
      id: m.id,
      type: params.type,
      title: m.title || m.name,
      original_title: m.original_title || m.original_name || "",
      poster: m.poster_path,
      year: (m.release_date || m.first_air_date || "N/A").slice(0, 4),
      overview: m.overview || "No overview available.",
      rating: m.vote_average || 0,
      vote_count: m.vote_count || 0,
      stremioLink: m.stremioLink || null,
      genres: (m.genre_ids || []).map((id) => idToGenre[id] || "Unknown"),
    }));
    return { type: "list", items, page: data.page, total_pages: data.total_pages };
  } catch {
    return { error: "Error fetching search results ❌" };
  }
};
