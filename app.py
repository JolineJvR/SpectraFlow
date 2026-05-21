import os
import requests
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret-key")

TMDB_KEY    = os.getenv("TMDB_API_KEY", "")
LASTFM_KEY  = os.getenv("LASTFM_API_KEY", "")
TMDB_BASE   = "https://api.themoviedb.org/3"
LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/"


# ── helpers ──────────────────────────────────────────────
def tmdb_get(endpoint, params=None):
    if not TMDB_KEY:
        raise ValueError("TMDB_API_KEY is missing from your .env file")
    params = params or {}
    params["api_key"] = TMDB_KEY
    params["language"] = "en-US"
    r = requests.get(f"{TMDB_BASE}{endpoint}", params=params, timeout=8)
    r.raise_for_status()
    return r.json()


def lastfm_get(params):
    if not LASTFM_KEY:
        raise ValueError("LASTFM_API_KEY is missing from your .env file")
    params["api_key"] = LASTFM_KEY
    params["format"]  = "json"
    r = requests.get(LASTFM_BASE, params=params, timeout=8)
    r.raise_for_status()
    return r.json()


def api_error(e):
    """Return a clean JSON error response instead of crashing."""
    return jsonify({"error": str(e)}), 500


# ── pages ─────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


# ── movies ────────────────────────────────────────────────
@app.route("/api/movies/trending")
def movies_trending():
    try:
        data = tmdb_get("/trending/movie/week")
        return jsonify(data.get("results", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/movies/search")
def movies_search():
    try:
        query = request.args.get("q", "")
        data  = tmdb_get("/search/movie", {"query": query, "page": 1})
        return jsonify(data.get("results", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/movies/genres")
def movie_genres():
    # NOTE: this route must be defined BEFORE /api/movies/<id>
    # so Flask doesn't try to match "genres" as an integer id
    try:
        data = tmdb_get("/genre/movie/list")
        return jsonify(data.get("genres", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/movies/genre/<int:genre_id>")
def movies_by_genre(genre_id):
    try:
        data = tmdb_get("/discover/movie", {
            "with_genres": genre_id,
            "sort_by": "popularity.desc"
        })
        return jsonify(data.get("results", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/movies/<int:movie_id>")
def movie_detail(movie_id):
    try:
        data = tmdb_get(f"/movie/{movie_id}")
        return jsonify(data)
    except Exception as e:
        return api_error(e)


# ── tv ────────────────────────────────────────────────────
@app.route("/api/tv/trending")
def tv_trending():
    try:
        data = tmdb_get("/trending/tv/week")
        return jsonify(data.get("results", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/tv/search")
def tv_search():
    try:
        query = request.args.get("q", "")
        data  = tmdb_get("/search/tv", {"query": query})
        return jsonify(data.get("results", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/tv/genres")
def tv_genres():
    try:
        data = tmdb_get("/genre/tv/list")
        return jsonify(data.get("genres", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/tv/genre/<int:genre_id>")
def tv_by_genre(genre_id):
    try:
        data = tmdb_get("/discover/tv", {
            "with_genres": genre_id,
            "sort_by": "popularity.desc"
        })
        return jsonify(data.get("results", []))
    except Exception as e:
        return api_error(e)


@app.route("/api/tv/<int:tv_id>")
def tv_detail(tv_id):
    try:
        data = tmdb_get(f"/tv/{tv_id}")
        return jsonify(data)
    except Exception as e:
        return api_error(e)


# ── music ─────────────────────────────────────────────────
@app.route("/api/music/trending")
def music_trending():
    try:
        data   = lastfm_get({"method": "chart.gettoptracks", "limit": 20})
        tracks = data.get("tracks", {}).get("track", [])
        return jsonify(tracks)
    except Exception as e:
        return api_error(e)


@app.route("/api/music/search")
def music_search():
    try:
        query  = request.args.get("q", "")
        data   = lastfm_get({"method": "track.search", "track": query, "limit": 20})
        tracks = data.get("results", {}).get("trackmatches", {}).get("track", [])
        return jsonify(tracks if isinstance(tracks, list) else [tracks])
    except Exception as e:
        return api_error(e)


@app.route("/api/music/genre/<string:tag>")
def music_by_genre(tag):
    try:
        data   = lastfm_get({"method": "tag.gettoptracks", "tag": tag, "limit": 20})
        tracks = data.get("tracks", {}).get("track", [])
        return jsonify(tracks)
    except Exception as e:
        return api_error(e)


@app.route("/api/music/track")
def music_track_info():
    try:
        artist = request.args.get("artist", "")
        track  = request.args.get("track", "")
        data   = lastfm_get({"method": "track.getInfo", "artist": artist, "track": track})
        return jsonify(data.get("track", {}))
    except Exception as e:
        return api_error(e)


if __name__ == "__main__":
    app.run(debug=True)