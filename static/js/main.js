/* ═══════════════════════════════════════════
   SpectraFlow — main.js
═══════════════════════════════════════════ */

const TMDB_IMG      = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w780';

let activeTab   = 'movies';
let activeGenre = null;

const GENRE_FILTERS = {
  movies: ['Action','Comedy','Drama','Horror','Sci-Fi','Thriller','Romance','Animation'],
  tv:     ['Action','Comedy','Drama','Reality','Sci-Fi','Documentary','Kids'],
  music:  ['Pop','Rock','Hip-Hop','Electronic','R&B','Jazz','Classical','Indie']
};

const GENRE_ID_MAP = {
  movies: {Action:28,Comedy:35,Drama:18,Horror:27,'Sci-Fi':878,Thriller:53,Romance:10749,Animation:16},
  tv:     {Action:10759,Comedy:35,Drama:18,Reality:10764,'Sci-Fi':10765,Documentary:99,Kids:10762}
};

/* ── safe fetch — always returns parsed JSON or throws a readable error ── */
async function apiFetch(url) {
  const res  = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `Server error ${res.status}`);
  }
  return data;
}

/* ── TABS ── */
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    activeTab   = t.dataset.tab;
    activeGenre = null;
    document.getElementById('search-input').value = '';
    buildGenreFilter(activeTab);
    document.getElementById('sec-title').textContent =
      activeTab === 'movies' ? 'TRENDING MOVIES' :
      activeTab === 'tv'     ? 'TRENDING TV SHOWS' : 'TOP TRACKS';
    loadTab(activeTab);
  });
});

/* ── GENRE FILTER ── */
function buildGenreFilter(tab) {
  const wrap = document.getElementById('genre-filter');
  wrap.innerHTML = '';
  GENRE_FILTERS[tab].forEach(g => {
    const btn = document.createElement('button');
    btn.className    = 'genre-btn';
    btn.textContent  = g;
    btn.dataset.genre = g;
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      activeGenre = isActive ? null : g;
      if (!isActive) btn.classList.add('active');
      loadTab(activeTab);
    });
    wrap.appendChild(btn);
  });
}

/* ── SEARCH ── */
document.getElementById('search-btn').addEventListener('click', () => loadTab(activeTab));
document.getElementById('search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') loadTab(activeTab);
});

/* ── LOAD TAB ── */
async function loadTab(tab) {
  showSkeletons();
  const query = document.getElementById('search-input').value.trim();
  try {
    if (tab === 'movies')     await loadMovies(query);
    else if (tab === 'tv')    await loadTV(query);
    else                      await loadMusic(query);
  } catch (e) {
    showError(e.message);
  }
}

/* ════════════════════════════ MOVIES ════════════════════════════ */
async function loadMovies(query) {
  let url;
  if (query) {
    url = `/api/movies/search?q=${encodeURIComponent(query)}`;
  } else if (activeGenre && GENRE_ID_MAP.movies[activeGenre]) {
    url = `/api/movies/genre/${GENRE_ID_MAP.movies[activeGenre]}`;
  } else {
    url = '/api/movies/trending';
  }
  const data = await apiFetch(url);
  renderMovies(data);
}

function renderMovies(items) {
  const grid = document.getElementById('media-grid');
  grid.innerHTML = '';
  document.getElementById('sec-count').textContent = `${items.length} TITLES`;
  if (!items.length) { showEmpty('No titles found. Try a different search.'); return; }
  items.slice(0, 20).forEach((m, i) => {
    const card   = makeCard(i);
    const poster = m.poster_path
      ? `<img class="card-poster" src="${TMDB_IMG}${m.poster_path}" alt="${m.title}" loading="lazy">`
      : `<div class="card-poster-placeholder">🎬</div>`;
    card.innerHTML = `
      ${poster}
      <span class="card-type-badge badge-movie">FILM</span>
      <div class="card-overlay"><div class="card-overlay-btn">▶ VIEW DETAILS</div></div>
      <div class="card-body">
        <div class="card-title">${m.title}</div>
        <div class="card-meta">
          <span class="card-rating">★ ${m.vote_average ? m.vote_average.toFixed(1) : '—'}</span>
          <span>${m.release_date ? m.release_date.slice(0,4) : '—'}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => openMovieModal(m.id));
    grid.appendChild(card);
  });
}

async function openMovieModal(id) {
  try {
    const d      = await apiFetch(`/api/movies/${id}`);
    const banner = d.backdrop_path
      ? `<img class="modal-banner" src="${TMDB_BACKDROP}${d.backdrop_path}" alt="${d.title}">`
      : `<div class="modal-banner-placeholder">🎬</div>`;
    populateModal({
      banner,
      typeHtml: `<span style="color:var(--neon-pink);font-family:'VT323',monospace;letter-spacing:.2em">📼 MOVIE</span>`,
      title:    d.title,
      tagline:  d.tagline || '',
      meta: `
        <div class="modal-meta-item"><div class="modal-meta-val">${d.vote_average ? d.vote_average.toFixed(1) : '—'}</div><div class="modal-meta-key">RATING</div></div>
        <div class="modal-meta-item"><div class="modal-meta-val">${d.release_date ? d.release_date.slice(0,4) : '—'}</div><div class="modal-meta-key">YEAR</div></div>
        <div class="modal-meta-item"><div class="modal-meta-val">${d.runtime ? d.runtime + ' min' : '—'}</div><div class="modal-meta-key">RUNTIME</div></div>`,
      overview: d.overview || 'No overview available.',
      genres:   (d.genres || []).map(g => g.name)
    });
  } catch (e) { showError(e.message); }
}

/* ════════════════════════════ TV ════════════════════════════ */
async function loadTV(query) {
  let url;
  if (query) {
    url = `/api/tv/search?q=${encodeURIComponent(query)}`;
  } else if (activeGenre && GENRE_ID_MAP.tv[activeGenre]) {
    url = `/api/tv/genre/${GENRE_ID_MAP.tv[activeGenre]}`;
  } else {
    url = '/api/tv/trending';
  }
  const data = await apiFetch(url);
  renderTV(data);
}

function renderTV(items) {
  const grid = document.getElementById('media-grid');
  grid.innerHTML = '';
  document.getElementById('sec-count').textContent = `${items.length} SHOWS`;
  if (!items.length) { showEmpty('No shows found.'); return; }
  items.slice(0, 20).forEach((s, i) => {
    const card   = makeCard(i);
    const poster = s.poster_path
      ? `<img class="card-poster" src="${TMDB_IMG}${s.poster_path}" alt="${s.name}" loading="lazy">`
      : `<div class="card-poster-placeholder">📺</div>`;
    card.innerHTML = `
      ${poster}
      <span class="card-type-badge badge-tv">TV</span>
      <div class="card-overlay"><div class="card-overlay-btn">▶ VIEW DETAILS</div></div>
      <div class="card-body">
        <div class="card-title">${s.name}</div>
        <div class="card-meta">
          <span class="card-rating">★ ${s.vote_average ? s.vote_average.toFixed(1) : '—'}</span>
          <span>${s.first_air_date ? s.first_air_date.slice(0,4) : '—'}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => openTVModal(s.id));
    grid.appendChild(card);
  });
}

async function openTVModal(id) {
  try {
    const d      = await apiFetch(`/api/tv/${id}`);
    const banner = d.backdrop_path
      ? `<img class="modal-banner" src="${TMDB_BACKDROP}${d.backdrop_path}" alt="${d.name}">`
      : `<div class="modal-banner-placeholder">📺</div>`;
    populateModal({
      banner,
      typeHtml: `<span style="color:var(--neon-blue);font-family:'VT323',monospace;letter-spacing:.2em">📺 TV SHOW</span>`,
      title:    d.name,
      tagline:  d.tagline || (d.networks?.[0]?.name ? `On ${d.networks[0].name}` : ''),
      meta: `
        <div class="modal-meta-item"><div class="modal-meta-val">${d.vote_average ? d.vote_average.toFixed(1) : '—'}</div><div class="modal-meta-key">RATING</div></div>
        <div class="modal-meta-item"><div class="modal-meta-val">${d.number_of_seasons ?? '—'} S</div><div class="modal-meta-key">SEASONS</div></div>
        <div class="modal-meta-item"><div class="modal-meta-val">${d.number_of_episodes ?? '—'} EP</div><div class="modal-meta-key">EPISODES</div></div>`,
      overview: d.overview || 'No overview available.',
      genres:   (d.genres || []).map(g => g.name)
    });
  } catch (e) { showError(e.message); }
}

/* ════════════════════════════ MUSIC ════════════════════════════ */
async function loadMusic(query) {
  let url;
  if (query) {
    url = `/api/music/search?q=${encodeURIComponent(query)}`;
  } else if (activeGenre) {
    url = `/api/music/genre/${encodeURIComponent(activeGenre.toLowerCase())}`;
  } else {
    url = '/api/music/trending';
  }
  const data = await apiFetch(url);
  renderMusic(data);
}

function renderMusic(items) {
  const grid = document.getElementById('media-grid');
  grid.innerHTML = '';
  document.getElementById('sec-count').textContent = `${items.length} TRACKS`;
  if (!items.length) { showEmpty('No tracks found.'); return; }
  items.slice(0, 20).forEach((t, i) => {
    const card  = makeCard(i);
    const img   = t.image?.find(x => x.size === 'extralarge')?.['#text'];
    const poster = img && img !== ''
      ? `<img class="card-poster" src="${img}" alt="${t.name}" loading="lazy">`
      : `<div class="card-poster-placeholder">🎵</div>`;
    card.innerHTML = `
      ${poster}
      <span class="card-type-badge badge-music">TRACK</span>
      <div class="card-overlay"><div class="card-overlay-btn">▶ VIEW DETAILS</div></div>
      <div class="card-body">
        <div class="card-title">${t.name}</div>
        <div class="card-meta"><span style="color:var(--neon-green)">${t.artist?.name || t.artist || ''}</span></div>
      </div>`;
    card.addEventListener('click', () => openMusicModal(t));
    grid.appendChild(card);
  });
}

async function openMusicModal(t) {
  const artist = t.artist?.name || t.artist || '';
  let info = t;
  try {
    const extra = await apiFetch(`/api/music/track?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(t.name)}`);
    info = { ...t, ...extra };
  } catch {}

  const img = t.image?.find(x => x.size === 'extralarge')?.['#text'];
  populateModal({
    banner: img && img !== ''
      ? `<img class="modal-banner" src="${img}" alt="${t.name}">`
      : `<div class="modal-banner-placeholder">🎵</div>`,
    typeHtml: `<span style="color:var(--neon-green);font-family:'VT323',monospace;letter-spacing:.2em">🎵 TRACK</span>`,
    title:    t.name,
    tagline:  `by ${artist}`,
    meta: `
      <div class="modal-meta-item"><div class="modal-meta-val" style="font-size:16px">${info.playcount ? Number(info.playcount).toLocaleString() : '—'}</div><div class="modal-meta-key">PLAYS</div></div>
      <div class="modal-meta-item"><div class="modal-meta-val" style="font-size:16px">${info.listeners ? Number(info.listeners).toLocaleString() : '—'}</div><div class="modal-meta-key">LISTENERS</div></div>`,
    overview: info.wiki?.summary
      ? info.wiki.summary.replace(/<[^>]+>/g, '').split('.').slice(0,3).join('.') + '.'
      : 'No description available.',
    genres: (info.toptags?.tag || []).slice(0,5).map(g => g.name)
  });
}

/* ════════════════════════════ MODAL ════════════════════════════ */
function populateModal({ banner, typeHtml, title, tagline, meta, overview, genres }) {
  document.getElementById('modal-banner-wrap').innerHTML = banner;
  document.getElementById('modal-type').innerHTML        = typeHtml;
  document.getElementById('modal-title').textContent     = title;
  document.getElementById('modal-tagline').textContent   = tagline;
  document.getElementById('modal-meta-row').innerHTML    = meta;
  document.getElementById('modal-overview').textContent  = overview;
  document.getElementById('modal-genres').innerHTML      = genres.map(g => `<span class="modal-genre">${g}</span>`).join('');
  document.getElementById('modal-overlay').classList.add('open');
}

document.getElementById('modal-close').addEventListener('click', () =>
  document.getElementById('modal-overlay').classList.remove('open'));
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-overlay')
    document.getElementById('modal-overlay').classList.remove('open');
});

/* ════════════════════════════ HELPERS ════════════════════════════ */
function makeCard(i) {
  const card = document.createElement('div');
  card.className = 'media-card';
  card.style.animationDelay = `${i * 0.04}s`;
  return card;
}

function showSkeletons() {
  document.getElementById('media-grid').innerHTML =
    Array.from({ length: 12 }).map(() => `
      <div class="skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>`).join('');
}

function showEmpty(msg) {
  document.getElementById('media-grid').innerHTML = `
    <div class="empty-wrap">
      <div class="empty-icon">📼</div>
      <div class="empty-title">NOTHING FOUND</div>
      <p class="empty-sub">${msg}</p>
    </div>`;
}

function showError(msg) {
  document.getElementById('media-grid').innerHTML = `
    <div class="empty-wrap">
      <div class="empty-icon">⚠</div>
      <div class="empty-title">SOMETHING WENT WRONG</div>
      <p class="empty-sub">${msg}<br><br>
      Check that your <strong>.env</strong> file has valid API keys and restart Flask.</p>
    </div>`;
}

/* ── INIT ── */
buildGenreFilter('movies');
loadTab('movies');