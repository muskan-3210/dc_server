const { Router } = require("express");

const router = Router();

const MAX_PAGE = 500; // TMDB serves pages 1..500 only
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map(); // page -> { expires, payload }

// Retry because the connection to TMDB drops now and then ("fetch failed").
async function fetchTmdb(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(8000) });
    } catch (err) {
      console.error(`TMDB attempt ${i} failed:`, err.cause?.code || err.message);
      if (i === tries) throw err;
      await new Promise((r) => setTimeout(r, 300 * i));
    }
  }
}

// GET /api/movies?page=1  ->  popular movies from TMDB
router.get("/", async (req, res, next) => {
  try {
    const page = Math.min(Math.max(Number(req.query.page) || 1, 1), MAX_PAGE);

    const cached = cache.get(page);
    if (cached && cached.expires > Date.now()) {
      return res.json(cached.payload);
    }

    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=${page}&api_key=${process.env.TMDB_API_KEY}`;

    let response;
    try {
      response = await fetchTmdb(url);
    } catch {
      // TMDB unreachable: fall back to an expired copy of this page if we still have one.
      if (cached) return res.json(cached.payload);
      return res.status(502).json({ success: false, message: "Could not reach the movie service. Try again." });
    }

    if (!response.ok) {
      return res.status(502).json({ success: false, message: "Movie service failed" });
    }
    const json = await response.json();

    const payload = {
      success: true,
      data: json.results.map((m) => ({
        id: m.id,
        title: m.title,
        overview: m.overview,
        rating: m.vote_average,
        release_date: m.release_date,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
      })),
      meta: { page: json.page, total_pages: Math.min(json.total_pages, MAX_PAGE) },
    };

    cache.set(page, { expires: Date.now() + CACHE_TTL_MS, payload });
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
