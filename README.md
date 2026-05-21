# SpectraFlow 📼
> Retro Blockbuster-style media discovery app — Movies, TV Shows & Music

Built with Flask + Python on the backend, plain HTML/CSS/JS on the frontend.
API keys are stored securely in a `.env` file and never exposed to the browser.

---

## Project Structure

```
spectraflow/
├── app.py                  # Flask app & all API routes
├── requirements.txt        # Python dependencies
├── .env.example            # Template — copy to .env and fill in your keys
├── .gitignore              # Keeps .env out of GitHub
├── templates/
│   └── index.html          # Main Jinja2 template
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

---

## Getting Started

### 1. Get your API keys

- **TMDB** (movies & TV): https://www.themoviedb.org/settings/api — free account required
- **Last.fm** (music): https://www.last.fm/api/account/create — free account required

### 2. Set up your environment

```bash
# Clone or download the project, then:
cd spectraflow

# Create a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Copy the .env template and fill in your keys
cp .env.example .env
```

### 3. Edit your `.env` file

```
TMDB_API_KEY=paste_your_tmdb_key_here
LASTFM_API_KEY=paste_your_lastfm_key_here
FLASK_SECRET_KEY=any_long_random_string
FLASK_ENV=development
```

### 4. Run the app

```bash
python app.py
```

Then open http://localhost:5000 in your browser.

---

## Features
- 🎬 Browse & search trending movies (TMDB)
- 📺 Browse & search trending TV shows (TMDB)
- 🎵 Browse & search top music tracks (Last.fm)
- 🔍 Search across all three categories
- 🎭 Filter by genre
- 📋 Detail modal for every item
- 📼 Retro Blockbuster aesthetic with VHS scanlines

---

## Security Note
Your `.env` file is listed in `.gitignore` — it will **never** be committed to GitHub.
All API keys live on the server side inside Flask routes. The browser never sees them.