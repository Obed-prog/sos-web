/* ════════════════════════════════════════════════════════════
   SOS CHURCH OF CHRIST — behaviour
   ────────────────────────────────────────────────────────────
   Everything here is progressive enhancement. With JavaScript
   off, the whole page is simply visible — nothing is hidden.
   (The stylesheet only hides things under the `js` class that
   this first line adds.)
   ════════════════════════════════════════════════════════════ */

document.documentElement.classList.add('js');

var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── antigravity parallax ───────────────────────────────────
   Depth on scroll: the hero photo drifts at a third of the
   page's speed, while the hero copy floats gently upward and
   fades as you leave it. One passive listener, one rAF frame,
   transforms only — and nothing at all under reduced motion. */

if (!reducedMotion) {
  (function () {
    var hero = document.querySelector('.hero');
    var bg = document.querySelector('.hero-bg');
    var copy = document.querySelector('.hero-content');
    if (!hero || !bg) return;

    var ticking = false;

    function drift() {
      ticking = false;
      var s = window.scrollY || window.pageYOffset || 0;
      var h = hero.offsetHeight || 1;
      if (s > h) return;                     /* hero is gone — nothing to move */
      bg.style.transform = 'translate3d(0,' + (s * 0.32).toFixed(1) + 'px,0)';
      if (copy) {
        copy.style.transform = 'translate3d(0,' + (s * -0.12).toFixed(1) + 'px,0)';
        copy.style.opacity = Math.max(0, 1 - s / (h * 0.85)).toFixed(3);
      }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(drift); }
    }, { passive: true });
  })();
}

/* ── text reveals: split headings for masked rises ──────────
   The hero headline rises word by word; every section heading
   rises out of an invisible mask when its section arrives.
   Skipped entirely under reduced motion (text just shows). */

if (!reducedMotion) {
  /* hero h1 → one mask per word, gently staggered */
  var heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    var words = heroH1.textContent.trim().split(/\s+/);
    heroH1.textContent = '';
    words.forEach(function (word, i) {
      var w = document.createElement('span');
      var wi = document.createElement('span');
      w.className = 'w'; wi.className = 'wi';
      wi.textContent = word;
      wi.style.animationDelay = (0.4 + i * 0.08) + 's';
      w.appendChild(wi);
      heroH1.appendChild(w);
      if (i < words.length - 1) heroH1.appendChild(document.createTextNode(' '));
    });
    heroH1.classList.add('h1-split');
  }

  /* section h2s → whole heading rises from behind its baseline
     (the theme-script h2 has its own handwriting animation) */
  document.querySelectorAll('main h2:not(.theme-script)').forEach(function (h) {
    var line = document.createElement('span');
    line.className = 'h2-line';
    while (h.firstChild) line.appendChild(h.firstChild);
    h.appendChild(line);
    h.classList.add('h-split');
  });
}

/* ── nav: transparent over the hero, paper + hairline after ── */

var nav = document.querySelector('.nav');
var hero = document.querySelector('.hero');
var ticking = false;

function updateNav() {
  var threshold = hero ? hero.offsetHeight - 80 : 80;
  nav.classList.toggle('scrolled', window.scrollY > threshold);
  ticking = false;
}
window.addEventListener('scroll', function () {
  if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
}, { passive: true });
updateNav();

/* ── mobile menu ─────────────────────────────────────────── */

var menuBtn = document.querySelector('.menu-btn');
var siteNav = document.getElementById('site-nav');

function closeMenu() {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', function () {
  var open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
siteNav.addEventListener('click', function (e) {
  if (e.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeMenu();
});

/* ── scroll reveals: sections fade up once as they enter ──── */

var revealTargets = document.querySelectorAll('[data-reveal]');

if (reducedMotion || !('IntersectionObserver' in window)) {
  /* final state immediately — no motion */
  revealTargets.forEach(function (el) { el.classList.add('in'); });
} else {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -48px 0px' });

  revealTargets.forEach(function (el) { revealObserver.observe(el); });
}

/* ════════════════════════════════════════════════════════════
   LIVE CONTENT FROM GOOGLE — how the church updates this site
   ────────────────────────────────────────────────────────────
   Nothing weekly or monthly is typed into the code:

   · ROSTER  — an admin edits a Google Sheet (see the roster
               section comment in index.html).
   · NEWS & EVENTS — an admin fills the "SOS Church — site
               update" GOOGLE FORM from any phone. Responses
               land in a Google Sheet; this file reads it.
               Run admin-form-setup.gs once to create that
               form (full instructions inside that file).

   Each needs its published-CSV link pasted below, one time.
   ════════════════════════════════════════════════════════════ */

var ROSTER_SHEET_CSV  = '';  /* ← roster sheet published-CSV link */
var CONTENT_SHEET_CSV = '';  /* ← form-responses sheet published-CSV link */

/* ── shared helpers ─────────────────────────────────────────── */

/* tiny CSV parser — handles quoted fields, commas and newlines inside quotes */
function parseCSV(text) {
  var rows = [], row = [], field = '', inQuotes = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  /* drop fully-empty trailing rows */
  return rows.filter(function (r) { return r.some(function (v) { return v.trim() !== ''; }); });
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fetchCSV(url) {
  return fetch(url, { mode: 'cors' }).then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.text();
  }).then(parseCSV);
}

/* dates arrive from Google Sheets as day/month/year (the setup
   script pins the sheet to the en_GB locale); ISO dates and
   unambiguous forms are handled too */
function parseSheetDate(s) {
  s = (s || '').trim();
  var m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (m) {
    var a = +m[1], b = +m[2], y = +m[3];
    if (y < 100) y += 2000;
    if (a > 12) return new Date(y, b - 1, a);   /* must be day-first */
    if (b > 12) return new Date(y, a - 1, b);   /* must be month-first */
    return new Date(y, b - 1, a);               /* ambiguous → day-first */
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function shortDate(d) { return MONTHS[d.getMonth()] + ' ' + d.getDate(); }

/* ── service roster: filled from a published Google Sheet ───── */

(function () {
  var table = document.querySelector('[data-roster]');
  if (!table || !ROSTER_SHEET_CSV) return;   /* no sheet yet → keep the fallback */

  var status = document.querySelector('[data-roster-status]');

  function render(rows) {
    if (rows.length < 2 || rows[0].length < 2) throw new Error('unexpected roster shape');

    var dates = rows[0];               /* [blank, date1, date2, …] */
    var thead = '<tr><th scope="col"><span class="visually-hidden">Role</span></th>';
    for (var c = 1; c < dates.length; c++) {
      var isFirst = c === 1;
      var label = isFirst
        ? 'This Sunday · ' + esc(dates[c].trim())
        : esc(dates[c].trim());
      thead += '<th scope="col" class="sc' + (isFirst ? ' today' : '') + '">' + label + '</th>';
    }
    thead += '</tr>';

    var tbody = '';
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      tbody += '<tr><th scope="row" class="sc">' + esc((cells[0] || '').trim()) + '</th>';
      for (var k = 1; k < dates.length; k++) {
        var name = (cells[k] || '').trim();
        tbody += name
          ? '<td>' + esc(name) + '</td>'
          : '<td class="tba">—</td>';
      }
      tbody += '</tr>';
    }

    table.querySelector('thead').innerHTML = thead;
    table.querySelector('tbody').innerHTML = tbody;
    if (status) { status.hidden = false; }
  }

  fetchCSV(ROSTER_SHEET_CSV)
    .then(render)
    .catch(function (err) {
      /* leave the "to be announced" fallback in place, quietly */
      if (window.console) console.warn('Roster sheet not loaded:', err.message);
    });
})();

/* ── news & events: filled from the Google Form's sheet ───────
   One form, one sheet. Expected columns (any order, matched by
   header name): Timestamp · What is this? (Announcement/Event) ·
   Title · Date · Details.
   Events  → the three soonest that haven't passed.
   News    → the three most recent announcements. */

(function () {
  if (!CONTENT_SHEET_CSV) return;   /* form not connected yet → keep fallbacks */

  var newsList  = document.querySelector('.news-list');
  var eventGrid = document.querySelector('.event-grid');
  if (!newsList && !eventGrid) return;

  function findCol(headers, words) {
    for (var i = 0; i < headers.length; i++) {
      var h = headers[i].toLowerCase();
      for (var w = 0; w < words.length; w++) {
        if (h.indexOf(words[w]) !== -1) return i;
      }
    }
    return -1;
  }

  fetchCSV(CONTENT_SHEET_CSV).then(function (rows) {
    if (rows.length < 2) return;   /* no submissions yet → keep fallbacks */

    var head  = rows[0];
    var iType = findCol(head, ['what', 'type']);
    var iTitle = findCol(head, ['title']);
    var iDate  = findCol(head, ['date']);
    var iBody  = findCol(head, ['detail', 'description']);
    if (iType < 0 || iTitle < 0 || iDate < 0 || iBody < 0) {
      throw new Error('unexpected form-sheet columns');
    }

    var items = rows.slice(1).map(function (r, n) {
      return {
        type:  (r[iType]  || '').trim().toLowerCase(),
        title: (r[iTitle] || '').trim(),
        date:  parseSheetDate(r[iDate] || ''),
        body:  (r[iBody]  || '').trim(),
        order: n
      };
    }).filter(function (it) { return it.title && it.date; });

    /* events: soonest first, only those still ahead (or today) */
    if (eventGrid) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var events = items.filter(function (it) {
        return it.type.indexOf('event') === 0 && it.date >= today;
      }).sort(function (a, b) { return a.date - b.date; }).slice(0, 3);

      if (events.length) {
        eventGrid.innerHTML = events.map(function (ev) {
          return '<li class="card event-card">' +
                   '<span class="date-chip sc">' + esc(shortDate(ev.date)) + '</span>' +
                   '<h3>' + esc(ev.title) + '</h3>' +
                   '<p>' + esc(ev.body) + '</p>' +
                 '</li>';
        }).join('');
      } else {
        eventGrid.innerHTML =
          '<li class="events-empty">Nothing on the calendar just now — check back after Sunday.</li>';
      }
    }

    /* announcements: newest first */
    if (newsList) {
      var news = items.filter(function (it) {
        return it.type.indexOf('announce') === 0;
      }).sort(function (a, b) { return (b.date - a.date) || (b.order - a.order); }).slice(0, 3);

      if (news.length) {
        newsList.innerHTML = news.map(function (it) {
          return '<li class="news-item">' +
                   '<span class="row-meta sc">' + esc(shortDate(it.date)) + '</span>' +
                   '<div>' +
                     '<h3 class="row-title">' + esc(it.title) + '</h3>' +
                     '<p>' + esc(it.body) + '</p>' +
                   '</div>' +
                 '</li>';
        }).join('');
      }
    }
  }).catch(function (err) {
    /* fallbacks stay in place, quietly */
    if (window.console) console.warn('Content sheet not loaded:', err.message);
  });
})();

/* ── the theme band: start the handwriting when it arrives ── */

var giveBand = document.querySelector('.give');

if (giveBand) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    giveBand.classList.add('written');
  } else {
    var themeObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        giveBand.classList.add('written');
        themeObserver.disconnect();
      }
    }, { threshold: 0.35 });
    themeObserver.observe(giveBand);
  }
}
