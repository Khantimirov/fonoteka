window.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('main');

    if(element){
      requestAnimationFrame(()=>{
        element.classList.remove('opacity-20', 'translate-y-5');
        element.classList.add('opacity-100', 'translate-y-0');
      })
    }
  }
)

function togglePulse(){
  document.getElementById("pulsingImage").classList.toggle("pulse");
}

const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const main = document.getElementById("main");
let data, songs = {};

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const box = (title, inner) => `<section class="bg-black/20 rounded-2xl p-5"><h2 class="text-3xl font-bold mb-3">${esc(title)}</h2>${inner}</section>`;
const img = (src, size) => `<img src="${esc(src)}" alt="" class="${size} rounded-2xl object-cover bg-neutral-600" onerror="this.removeAttribute('src')">`;

function cards(items, size, pageName) {
  return `<div class="flex flex-wrap gap-5">` + items.map(i =>
    `<a href="${pageName}.html?id=${i.id}" class="text-center block" style="width:${size}px">
       ${img(i.coverlink, "w-full aspect-square")}
       <p class="mt-1">${esc(i.name)}</p>
     </a>`).join("") + `</div>`;
}

function songCards(list) {
  return `<div class="flex flex-wrap gap-5">` + list.map(s =>
    `<button data-song="${s.id}" class="text-center block w-[164px]">
       ${img(s.coverlink, "w-full aspect-square")}
       <p class="mt-1">${esc(s.name)}</p>
     </button>`).join("") + `</div>`;
}

function songList(list) {
  return `<ol class="text-xl space-y-1">` + list.map(s =>
    `<li><button data-song="${s.id}" class="block w-full text-left hover:bg-white/10 rounded px-2 py-1">${esc(s.artist)} - ${esc(s.name)}</button></li>`).join("") + `</ol>`;
}

const back = href => `<a href="${href}" class="text-3xl font-bold block mb-4">&larr; Back</a>`;
const idsToSongs = ids => ids.map(id => songs[id]).filter(Boolean);

function detail(item, backHref, subtitle) {
  if (!item) return back(backHref) + `<p class="text-xl">Not found.</p>`;
  return back(backHref) + box(item.name,
    `<div class="flex flex-wrap gap-6 mb-4">${img(item.coverlink, "w-[200px] h-[200px]")}</div>` +
    songList(idsToSongs(item.songs)));
}

function render() {
  const find = (list) => data[list].find(x => x.id === params.get("id"));
  const all = Object.values(songs);
  const views = {
    home: () => box("Quick Pick", songCards(all.slice(0, 5))) + box("Albums", cards(data.albums, 164, "album")),
    playlists: () => box("Playlists", cards(data.playlists, 164, "playlist")),
    favorites: () => box("Favorite Albums", cards(data.albums, 164, "album")) + box("Favorite Songs", songList(all.slice(0, 6))),
    charts: () => box("Genre Charts", cards(data.charts.slice(0, 5), 192, "chart")) + box("Regional Charts", cards(data.charts.slice(5), 192, "chart")),
    chart: () => detail(find("charts"), "charts.html"),
    album: () => { const a = find("albums"); return detail(a, "favorites.html", a && a.artist); },
    playlist: () => detail(find("playlists"), "playlists.html")
  };
  main.innerHTML = views[page]();
}

const audio = document.getElementById("player");
function play(id) {
  const s = songs[id];
  if (!s) return;
  document.getElementById("title").textContent = s.artist + " - " + s.name;
  const cover = document.getElementById("cover");
  cover.src = s.coverlink;
  audio.src = "music/" + id + ".m4a";
  audio.play().catch(() => {});
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-song]");
  if (b) play(b.dataset.song);
});

const navKey = {home:"home", playlists:"playlists", playlist:"playlists", favorites:"favorites", album:"favorites", charts:"charts", chart:"charts"}[page];
const active = document.querySelector(`[data-nav="${navKey}"]`);
if (active) { active.classList.remove("border-transparent"); active.classList.add("border-white"); }

fetch("record.json")
  .then(r => r.json())
  .then(d => { data = d; d.songs.forEach(s => songs[s.id] = s); render(); })
  .catch(() => {
    main.innerHTML = `<p class="text-xl">Could not load record.json. Browsers block this when you open the page by double-clicking it. Start a local server in this folder (for example: <b>python -m http.server</b>) and open <b>http://localhost:8000</b>.</p>`;
  });