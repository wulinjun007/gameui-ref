/* ============================================================
   GameUI Ref · 共享脚本
   依赖：assets/js/data.js（window.GAMEUI_DATA）
   ============================================================ */
(function () {
  'use strict';
  const D = window.GAMEUI_DATA;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];

  const thumb = (s, size) => 'https://img.gameui.net/' + s.sid + '-' + s.hash + '@1x' + (size || 360) + '.webp';
  const esc = (str) => String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => (n == null ? '—' : (n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, '') + 'w' : String(n)));
  const gameById = {};
  D.games.forEach((g) => (gameById[g.id] = g));

  const ICONS = {
    img: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    heart: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    eye: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'
  };

  /* ---------- 导航 ---------- */
  function initNav() {
    const page = document.body.dataset.page || '';
    $$('.nav-links a').forEach((a) => a.classList.toggle('on', a.dataset.nav === page));
    const input = $('#nav-search');
    const pop = $('#search-pop');
    if (!input || !pop) return;
    let timer = null;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = input.value.trim().toLowerCase();
        if (q.length < 1) { pop.classList.remove('open'); pop.innerHTML = ''; return; }
        const hit = (str) => String(str || '').toLowerCase().includes(q);
        const g = D.games.filter((x) => hit(x.title) || hit(x.author)).slice(0, 4);
        const w = D.works.filter((x) => hit(x.title) || hit(x.author)).slice(0, 3);
        const a = D.articles.filter((x) => hit(x.title) || hit(x.author)).slice(0, 3);
        let html = '';
        if (g.length) html += '<div class="sp-label">游戏 ' + g.length + '</div>' + g.map((x) =>
          '<a href="games.html?q=' + encodeURIComponent(x.title) + '"><img src="' + x.cover + '" alt="" loading="lazy"><span>' + eschl(x.title, q) + '<br><small style="color:var(--text-3)">' + esc(x.style) + ' · ' + esc(x.genre) + '</small></span></a>').join('');
        if (w.length) html += '<div class="sp-label">作品</div>' + w.map((x) =>
          '<a href="works.html?q=' + encodeURIComponent(x.title) + '"><img src="' + x.cover + '" alt="" loading="lazy"><span>' + eschl(x.title, q) + '<br><small style="color:var(--text-3)">' + esc(x.author) + '</small></span></a>').join('');
        if (a.length) html += '<div class="sp-label">文章</div>' + a.map((x) =>
          '<a href="articles.html?q=' + encodeURIComponent(x.title) + '"><img src="' + x.cover + '" alt="" loading="lazy"><span>' + eschl(x.title, q) + '<br><small style="color:var(--text-3)">' + esc(x.author) + '</small></span></a>').join('');
        if (!html) html = '<div class="sp-label">无结果 · 试试「原神」「国风」</div>';
        pop.innerHTML = html;
        pop.classList.add('open');
      }, 160);
    });
    document.addEventListener('click', (e) => { if (!pop.contains(e.target) && e.target !== input) pop.classList.remove('open'); });
  }
  function eschl(str, q) {
    const s = esc(str);
    const i = s.toLowerCase().indexOf(q);
    if (i < 0) return s;
    return s.slice(0, i) + '<b>' + s.slice(i, i + q.length) + '</b>' + s.slice(i + q.length);
  }

  /* ---------- 通用卡片 ---------- */
  function avatarChip(name) {
    const ch = esc((name || '?').trim().charAt(0).toUpperCase());
    return '<span class="avatar" aria-hidden="true">' + ch + '</span>';
  }
  function gameCard(g) {
    return '<article class="game-card reveal">' +
      '<div class="gc-cover" data-goto="games.html?q=' + encodeURIComponent(g.title) + '" role="link" tabindex="0" aria-label="' + esc(g.title) + '">' +
      '<img src="' + g.cover + '" alt="' + esc(g.title) + ' 界面封面" loading="lazy">' +
      (g.isNew ? '<span class="gc-new">NEW</span>' : '') +
      '<span class="gc-cnt">' + ICONS.img + fmt(g.shots) + '</span>' +
      '<span class="gc-meta">' + esc(g.platform) + ' · ' + esc(g.genre) + ' · ' + esc(g.style) + ' · ' + esc(g.year) + '</span>' +
      '</div>' +
      '<div class="gc-title">' + esc(g.title) + '</div>' +
      '<div class="gc-sub">' + avatarChip(g.author) + '<span class="nm">' + esc(g.author) + '</span>' +
      (g.views != null ? '<span class="st">' + ICONS.heart + fmt(g.likes) + '</span><span class="st">' + ICONS.eye + fmt(g.views) + '</span>' : '<span class="st badge-sky badge">精选</span>') +
      '</div></article>';
  }
  function workCard(w) {
    return '<article class="work-card reveal">' +
      '<div class="wc-cover" data-lbwork="' + w.id + '" role="button" tabindex="0" aria-label="' + esc(w.title) + '">' +
      '<img src="' + w.cover + '" alt="' + esc(w.title) + '" loading="lazy"></div>' +
      '<div class="wc-body"><div class="wc-title">' + esc(w.title) + '</div>' +
      '<div class="wc-sub">' + avatarChip(w.author) + '<span>' + esc(w.author) + '</span>' +
      '<span class="st">' + ICONS.heart + fmt(w.likes) + '</span><span class="st">' + ICONS.eye + fmt(w.views) + '</span>' +
      '<a class="st" href="https://www.gameui.net/works/' + w.id + '" target="_blank" rel="noopener" title="在 GAMEUI.net 查看">源↗</a>' +
      '</div></div></article>';
  }
  function articleCard(a) {
    return '<a class="article-card reveal" href="https://www.gameui.net/articles/' + a.id + '" target="_blank" rel="noopener">' +
      '<div class="ac-cover"><img src="' + a.cover + '" alt="' + esc(a.title) + '" loading="lazy"></div>' +
      '<div class="ac-body"><span style="display:flex;gap:8px"><span class="badge badge-sky">' + esc(a.category) + '</span></span>' +
      '<div class="ac-title">' + esc(a.title) + '</div>' +
      '<div class="ac-meta"><span>' + esc(a.author) + '</span>' +
      (a.views ? '<span class="mono">♡ ' + fmt(a.likes) + ' · 👁 ' + fmt(a.views) + '</span>' : '') +
      '<span class="mono" style="margin-left:auto">原文 ↗</span></div></div></a>';
  }

  /* ---------- 灯箱 ---------- */
  const LB = { list: [], idx: 0, kind: 'shot' };
  function ensureLightbox() {
    if ($('#lightbox')) return;
    const div = document.createElement('div');
    div.className = 'lightbox'; div.id = 'lightbox';
    div.innerHTML =
      '<button class="btn btn-ghost lb-x" aria-label="关闭">✕ esc</button>' +
      '<div class="lb-stage">' +
      '<button class="lb-nav lb-prev" aria-label="上一张">←</button>' +
      '<img id="lb-img" alt="预览大图">' +
      '<button class="lb-nav lb-next" aria-label="下一张">→</button>' +
      '</div><aside class="lb-side" id="lb-side"></aside>';
    document.body.appendChild(div);
    $('#lightbox').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox' || e.target.closest('.lb-x')) closeLB();
    });
    $('.lb-prev').addEventListener('click', () => stepLB(-1));
    $('.lb-next').addEventListener('click', () => stepLB(1));
    document.addEventListener('keydown', (e) => {
      if (!$('#lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') stepLB(-1);
      if (e.key === 'ArrowRight') stepLB(1);
    });
  }
  function openShotLB(list, idx) {
    ensureLightbox();
    LB.list = list; LB.idx = idx; LB.kind = 'shot';
    renderLB();
    $('#lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function openWorkLB(id) {
    const list = D.works;
    const idx = list.findIndex((w) => w.id === id);
    if (idx < 0) return;
    ensureLightbox();
    LB.list = list; LB.idx = idx; LB.kind = 'work';
    renderLB();
    $('#lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    $('#lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  function stepLB(d) {
    LB.idx = (LB.idx + d + LB.list.length) % LB.list.length;
    renderLB();
  }
  function renderLB() {
    const item = LB.list[LB.idx];
    const img = $('#lb-img');
    const side = $('#lb-side');
    if (LB.kind === 'shot') {
      // 大图 1080 → 720 → 360 逐级回退
      img.onerror = function () {
        if (this.dataset.fb === '1080') { this.dataset.fb = '720'; this.src = thumb(item, 720); }
        else if (this.dataset.fb === '720') { this.dataset.fb = '360'; this.src = thumb(item, 360); }
        else this.onerror = null;
      };
      img.dataset.fb = '1080';
      img.src = thumb(item, 1080);
      img.onload = () => { $('#lb-dim').textContent = img.naturalWidth + ' × ' + img.naturalHeight; };
      const g = gameById[item.gid] || {};
      side.innerHTML =
        '<div><div class="eyebrow">Screenshot · <span class="mono">' + item.sid + '</span></div>' +
        '<div class="game" style="margin-top:10px">' + esc(g.title || item.gid) + '</div>' +
        '<div style="font-size:13px;color:var(--text-2)">上传者 ' + esc(g.author || '—') + '</div></div>' +
        '<div class="lb-tags">' + (g.tags || []).map((t) => '<span class="badge badge-neutral">' + esc(t) + '</span>').join('') +
        '<span class="badge badge-sky">' + esc(g.style || '') + '</span></div>' +
        '<div>' +
        '<div class="lb-row"><span class="k">界面尺寸</span><span class="v" id="lb-dim">加载中…</span></div>' +
        '<div class="lb-row"><span class="k">平台 / 类型</span><span class="v">' + esc(g.platform || '—') + ' · ' + esc(g.genre || '—') + '</span></div>' +
        '<div class="lb-row"><span class="k">收录库编号</span><span class="v">#' + item.sid + '</span></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        '<a class="btn btn-sky btn-sm" href="screenshots.html?game=' + encodeURIComponent(g.title || '') + '">看全集 ' + fmt(g.shots) + ' 张</a>' +
        '<a class="btn btn-ghost btn-sm" href="https://www.gameui.net/images/' + item.sid + '" target="_blank" rel="noopener">GAMEUI 源页 ↗</a>' +
        '</div>' +
        '<p style="font-size:11.5px;color:var(--text-3);line-height:1.6">图片来自 GAMEUI.net 收录的公开游戏界面，版权归原作者与游戏公司所有，仅供学习参考。</p>';
    } else {
      const w = item;
      img.onerror = null;
      img.src = w.cover;
      side.innerHTML =
        '<div><div class="eyebrow">Design Work</div>' +
        '<div class="game" style="margin-top:10px">' + esc(w.title) + '</div>' +
        '<div style="font-size:13px;color:var(--text-2)">' + esc(w.author) + ' · ' + esc(w.category) + '</div></div>' +
        '<div>' +
        '<div class="lb-row"><span class="k">喜欢</span><span class="v">' + fmt(w.likes) + '</span></div>' +
        '<div class="lb-row"><span class="k">浏览</span><span class="v">' + fmt(w.views) + '</span></div>' +
        '<div class="lb-row"><span class="k">作品编号</span><span class="v">#' + w.id + '</span></div>' +
        '</div>' +
        '<a class="btn btn-sky btn-sm" href="https://www.gameui.net/works/' + w.id + '" target="_blank" rel="noopener">GAMEUI 源页 ↗</a>' +
        '<p style="font-size:11.5px;color:var(--text-3);line-height:1.6">作品版权归原作者所有，收录于 GAMEUI.net，仅供学习参考。</p>';
    }
  }
  document.addEventListener('click', (e) => {
    const w = e.target.closest('[data-lbwork]');
    if (w) { openWorkLB(w.dataset.lbwork); }
  });

  /* ---------- 首页 ---------- */
  function pageIndex() {
    // hero 背景拼贴
    const heroBg = $('#hero-bg');
    if (heroBg) {
      const pick = [0, 137, 262, 389, 517, 644, 771, 898, 1025, 1152, 63, 190];
      heroBg.innerHTML = pick.map((i) => '<img src="' + thumb(D.shots[i], 360) + '" alt="" loading="eager">').join('');
    }
    // stats
    const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
    set('#st-games', D.games.length); set('#st-shots', D.shots.length);
    set('#st-works', D.works.length); set('#st-articles', D.articles.length);
    // hot games
    const hot = D.games.filter((g) => g.hot);
    $('#hot-games').innerHTML = hot.map(gameCard).join('');
    // styles
    $('#style-grid').innerHTML = D.styles.map((s) => {
      const rep = D.games.find((g) => g.style === s.name && g.cover);
      return '<a class="style-card" href="games.html?style=' + encodeURIComponent(s.name) + '">' +
        (rep ? '<img src="' + rep.cover + '" alt="" loading="lazy">' : '') +
        '<span class="sc-txt"><b>' + esc(s.name) + '</b><span>' + s.count + ' 款游戏</span></span></a>';
    }).join('');
    // latest shots preview（每游戏取前几张混排）
    const mixed = [];
    for (let r = 0; r < 12; r++) {
      const g = hot[r % hot.length];
      const list = D.shots.filter((s) => s.gid === g.id);
      mixed.push(list[Math.floor(r / hot.length) * 7 + (r % 7)] || list[r]);
    }
    $('#shot-preview').innerHTML = mixed.map((s, i) =>
      '<button class="shot" data-shots="preview" data-idx="' + i + '" aria-label="查看截图"><img src="' + thumb(s, 360) + '" data-full="1" loading="lazy" onload="this.classList.add(\'ld\')">' +
      '<span class="sh-cap">' + esc(gameById[s.gid].title) + '<span class="mono">#' + s.sid + '</span></span></button>').join('');
    $('#shot-preview').addEventListener('click', (e) => {
      const b = e.target.closest('[data-shots="preview"]');
      if (b) openShotLB(mixed, +b.dataset.idx);
    });
    // works + articles
    const topWorks = D.works.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
    $('#work-preview').innerHTML = topWorks.map(workCard).join('');
    const topArts = D.articles.filter((a) => a.views).sort((a, b) => b.views - a.views).slice(0, 4);
    $('#article-preview').innerHTML = topArts.map(articleCard).join('');
  }

  /* ---------- 游戏库 ---------- */
  function pageGames() {
    const state = { style: null, platform: null, genre: null, year: null, q: '', sort: 'recent' };
    const params = new URLSearchParams(location.search);
    ['style', 'platform', 'genre', 'year', 'q', 'sort'].forEach((k) => { if (params.get(k)) state[k] = params.get(k); });

    // 统计各维度
    const uniq = (arr) => [...new Set(arr.filter(Boolean))];
    const dims = {
      style: uniq(D.games.map((g) => g.style)),
      platform: uniq(D.games.map((g) => g.platform)),
      genre: uniq(D.games.map((g) => g.genre)),
      year: uniq(D.games.map((g) => g.year))
    };
    const count = (dim, val) => D.games.filter((g) => g[dim] === val).length;
    const sidebar = $('#filters');
    const groupNames = { style: '风格', platform: '平台', genre: '类型', year: '年份' };
    sidebar.innerHTML = Object.entries(dims).map(([dim, vals]) => {
      const label = groupNames[dim];
      const items = vals.slice().sort((a, b) => count(dim, b) - count(dim, a)).map((v) =>
        '<button class="fopt" data-dim="' + dim + '" data-val="' + esc(v) + '"><span class="dot"></span>' + esc(v) + '<span class="cnt">' + count(dim, v) + '</span></button>').join('');
      return '<div class="fgroup"><b>' + label + '</b>' + items + '</div>';
    }).join('');

    sidebar.addEventListener('click', (e) => {
      const b = e.target.closest('.fopt');
      if (!b) return;
      const dim = b.dataset.dim, val = b.dataset.val;
      state[dim] = state[dim] === val ? null : val;
      render();
    });

    let page = 1;
    const PER = 48;
    function filtered() {
      let list = D.games.filter((g) =>
        (!state.style || g.style === state.style) &&
        (!state.platform || g.platform === state.platform) &&
        (!state.genre || g.genre === state.genre) &&
        (!state.year || g.year === state.year) &&
        (!state.q || (g.title + g.author + g.tags.join('')).toLowerCase().includes(state.q.toLowerCase())));
      if (state.sort === 'views') list = list.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
      if (state.sort === 'shots') list = list.slice().sort((a, b) => (b.shots || 0) - (a.shots || 0));
      return list;
    }
    const grid = $('#game-grid');
    const counter = $('#lib-count');
    const more = $('#load-more');
    function render() {
      page = 1;
      const list = filtered();
      counter.innerHTML = '共 <b>' + list.length + '</b> 款游戏' + (state.q ? ' · 关键词「' + esc(state.q) + '」' : '');
      grid.innerHTML = list.slice(0, PER).map(gameCard).join('');
      const emptyEl = $('#game-empty');
      if (emptyEl) emptyEl.classList.toggle('show', list.length === 0);
      more.style.display = list.length > PER ? '' : 'none';
      const p = new URLSearchParams();
      ['style', 'platform', 'genre', 'year', 'q', 'sort'].forEach((k) => { if (state[k]) p.set(k, state[k]); });
      history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
      // 筛选高亮
      $$('.fopt', sidebar).forEach((b) => b.classList.toggle('on', state[b.dataset.dim] === b.dataset.val));
      // chips
      const chips = $('#active-chips');
      chips.innerHTML = ['style', 'platform', 'genre', 'year'].filter((d) => state[d]).map((d) =>
        '<button class="chip on" data-clear="' + d + '">' + groupNames[d] + '：' + esc(state[d]) + ' ✕</button>').join('') +
        (state.q ? '<button class="chip on" data-clear="q">“' + esc(state.q) + '” ✕</button>' : '');
      observeReveal();
    }
    more.addEventListener('click', () => {
      page++;
      const list = filtered();
      grid.innerHTML = list.slice(0, page * PER).map(gameCard).join('');
      more.style.display = list.length > page * PER ? '' : 'none';
      observeReveal();
    });
    $('#active-chips').addEventListener('click', (e) => {
      const c = e.target.closest('[data-clear]');
      if (!c) return;
      state[c.dataset.clear] = c.dataset.clear === 'q' ? '' : null;
      if (c.dataset.clear === 'q') $('#lib-q').value = '';
      render();
    });
    $('#lib-q').value = state.q || '';
    $('#lib-q').addEventListener('input', (e) => { state.q = e.target.value.trim(); render(); });
    $('#lib-sort').value = state.sort;
    $('#lib-sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    render();
  }
  /* syncUrl 在 pageGames 闭包内定义 */

  /* ---------- 截图库 ---------- */
  function pageShots() {
    const params = new URLSearchParams(location.search);
    const state = { game: params.get('game') || null, q: params.get('q') || '' };
    let pool = D.shots.slice();
    const hotGames = D.games.filter((g) => g.hot);
    const chipsEl = $('#shot-chips');
    function renderChips() {
      chipsEl.innerHTML = '<button class="chip' + (!state.game ? ' on' : '') + '" data-g="">全部 ' + D.shots.length + '</button>' +
        hotGames.map((g) => {
          const n = D.shots.filter((s) => s.gid === g.id).length;
          return '<button class="chip' + (state.game === g.title ? ' on' : '') + '" data-g="' + esc(g.title) + '">' + esc(g.title) + ' ' + n + '</button>';
        }).join('');
    }
    chipsEl.addEventListener('click', (e) => {
      const c = e.target.closest('.chip');
      if (!c) return;
      state.game = c.dataset.g || null;
      render();
    });
    $('#shot-q').addEventListener('input', (e) => { state.q = e.target.value.trim(); render(); });

    const masonry = $('#masonry');
    const counter = $('#shot-count');
    const more = $('#shot-more');
    let shown = 0;
    const BATCH = 40;
    let view = [];
    function render() {
      view = pool.filter((s) => (!state.game || gameById[s.gid].title === state.game) &&
        (!state.q || gameById[s.gid].title.toLowerCase().includes(state.q.toLowerCase())));
      shown = 0; masonry.innerHTML = ''; append();
      counter.textContent = view.length + ' 张界面截图' + (state.game ? ' · ' + state.game : '');
      $('#shot-empty').classList.toggle('show', view.length === 0);
      renderChips();
      // 深链 ?sid=
      const sid = params.get('sid');
      if (sid) {
        const i = view.findIndex((s) => s.sid === sid);
        if (i >= 0) openShotLB(view, i);
        params.delete('sid');
      }
    }
    function append() {
      const slice = view.slice(shown, shown + BATCH);
      masonry.insertAdjacentHTML('beforeend', slice.map((s, i) =>
        '<button class="shot" data-i="' + (shown + i) + '" aria-label="查看截图"><img src="' + thumb(s, 360) + '" loading="lazy" onload="this.classList.add(\'ld\')">' +
        '<span class="sh-cap">' + esc(gameById[s.gid].title) + '<span class="mono">#' + s.sid + '</span></span></button>').join(''));
      shown += slice.length;
      more.style.display = shown < view.length ? '' : 'none';
    }
    more.addEventListener('click', append);
    masonry.addEventListener('click', (e) => {
      const b = e.target.closest('.shot');
      if (b) openShotLB(view, +b.dataset.i);
    });
    render();
  }

  /* ---------- 作品页 ---------- */
  function pageWorks() {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').toLowerCase();
    const grid = $('#work-grid');
    const more = $('#work-more');
    const PER = 24;
    let page = 1;
    const list = D.works.filter((w) => !q || (w.title + w.author + w.category).toLowerCase().includes(q));
    $('#work-count').textContent = '共 ' + list.length + ' 个作品' + (q ? ' · 「' + q + '」' : '');
    function render() {
      grid.innerHTML = list.slice(0, page * PER).map(workCard).join('');
      more.style.display = list.length > page * PER ? '' : 'none';
      observeReveal();
    }
    more.addEventListener('click', () => { page++; render(); });
    render();
  }

  /* ---------- 文章页 ---------- */
  function pageArticles() {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').toLowerCase();
    const list = D.articles.filter((a) => !q || (a.title + a.author + a.category).toLowerCase().includes(q));
    const el = $('#article-list');
    $('#article-count').textContent = '共 ' + list.length + ' 篇文章';
    el.innerHTML = list.map(articleCard).join('');
    observeReveal();
  }

  /* ---------- 入场动效（解释层级，非装饰） ---------- */
  let revealObs = null;
  function observeReveal() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    }
    $$('.reveal:not(.in)').forEach((el, i) => { el.style.transitionDelay = Math.min(i % 8, 5) * 40 + 'ms'; revealObs.observe(el); });
  }

  /* ---------- 启动 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    const page = document.body.dataset.page;
    if (page === 'index') pageIndex();
    if (page === 'games') pageGames();
    if (page === 'shots') pageShots();
    if (page === 'works') pageWorks();
    if (page === 'articles') pageArticles();
    observeReveal();
    // 卡片封面点击跳转
    document.addEventListener('click', (e) => {
      const g = e.target.closest('[data-goto]');
      if (g) location.href = g.dataset.goto;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const g = e.target.closest && e.target.closest('[data-goto]');
      if (g) location.href = g.dataset.goto;
    });
    // footer 年份
    const y = $('#fyear'); if (y) y.textContent = new Date().getFullYear();
  });
})();
