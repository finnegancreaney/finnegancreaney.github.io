/* World Cup 2026 — live fixtures, results and group tables.
 * Data: TheSportsDB free public key "3" (no account needed).
 *
 * NOTE on data strategy (changed 2026-06-15):
 * The free key now caps the bulk endpoints (eventsround / eventsseason /
 * eventspastleague) at ~5 events, so most fixtures — including Scotland's —
 * never arrived and tables stayed blank/stale. Instead we now fetch each of
 * the 48 nations individually via eventslast.php + eventsnext.php (which are
 * NOT capped), then merge + dedupe by idEvent. To respect the free key's
 * rate limit (~24 req/min before HTTP 429) every request is throttled and
 * every team is cached in localStorage, so warm loads are instant and only
 * stale teams are refetched. Featured teams (Scotland, England) load first. */
(function () {
    'use strict';

    const KEY = '3';
    const BASE = 'https://www.thesportsdb.com/api/v1/json/' + KEY;
    const WC_LEAGUE = '4429';           // FIFA World Cup (string — matches idLeague in payloads)
    const FRIENDLY_FILTER = true;       // keep only WC_LEAGUE events, drop friendlies/qualifiers

    const CACHE_KEY = 'wc2026_team_cache_v2';
    const REQ_GAP_MS = 2500;            // min gap between HTTP requests (~24/min, under the 429 wall)
    const FEATURED = ['Scotland', 'England']; // loaded first so Finn's teams appear soonest

    // How long a team's cached data stays "fresh" depends on how soon it next
    // plays — a team kicking off now needs frequent refreshes; one with no match
    // for days barely changes. This stops every visit re-crawling all 48 teams.
    const MINUTE = 60 * 1000, HOUR = 60 * MINUTE;
    const TTL_LIVE = 2 * MINUTE;        // match in progress → near-live scores
    const TTL_SOON = 10 * MINUTE;       // kicks off within 6h
    const TTL_NEAR = 6 * HOUR;          // plays within ~36h
    const TTL_IDLE = 24 * HOUR;         // no match imminent (or tournament over)
    const LIVE_WINDOW = 2.5 * HOUR;     // a kicked-off, unfinished match is treated as live for this long

    // Official 2026 group draw (names match TheSportsDB's exact spellings).
    const GROUPS = {
        A: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'],
        B: ['Canada', 'Bosnia-Herzegovina', 'Qatar', 'Switzerland'],
        C: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
        D: ['USA', 'Paraguay', 'Australia', 'Turkey'],
        E: ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
        F: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
        G: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
        H: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
        I: ['France', 'Senegal', 'Iraq', 'Norway'],
        J: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
        K: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
        L: ['England', 'Croatia', 'Ghana', 'Panama']
    };

    // TheSportsDB team ids (resolved & verified 2026-06-15). Used by the
    // per-team event endpoints — searchteams is capped/ambiguous at runtime,
    // so these are hardcoded.
    const TEAM_ID = {
        'Mexico': '134497', 'South Africa': '136482', 'South Korea': '134517', 'Czech Republic': '133904',
        'Canada': '140073', 'Bosnia-Herzegovina': '134510', 'Qatar': '136472', 'Switzerland': '134506',
        'Brazil': '134496', 'Morocco': '136139', 'Haiti': '140175', 'Scotland': '136450',
        'USA': '134514', 'Paraguay': '136471', 'Australia': '134500', 'Turkey': '135985',
        'Germany': '133907', 'Curaçao': '140271', 'Ivory Coast': '134502', 'Ecuador': '134507',
        'Netherlands': '133905', 'Japan': '134503', 'Sweden': '133916', 'Tunisia': '136142',
        'Belgium': '134515', 'Egypt': '136138', 'Iran': '134511', 'New Zealand': '137449',
        'Spain': '133909', 'Cape Verde': '136477', 'Saudi Arabia': '136137', 'Uruguay': '134504',
        'France': '133913', 'Senegal': '136143', 'Iraq': '140148', 'Norway': '136516',
        'Argentina': '134509', 'Algeria': '134516', 'Austria': '135986', 'Jordan': '140145',
        'Portugal': '133908', 'DR Congo': '136475', 'Uzbekistan': '140151', 'Colombia': '134501',
        'England': '133914', 'Croatia': '133912', 'Ghana': '134513', 'Panama': '136141'
    };

    const TEAM_GROUP = {};
    Object.keys(GROUPS).forEach(function (g) {
        GROUPS[g].forEach(function (t) { TEAM_GROUP[t] = g; });
    });

    let loaded = false;
    let refreshing = false;
    let badgeCache = {}; // team name -> badge url

    /* ---------- throttled fetch (rate-limit friendly) ---------- */

    let lastReqAt = 0;
    function throttledFetch(url, retries) {
        retries = retries == null ? 2 : retries;
        return new Promise(function (resolve) {
            const wait = Math.max(0, REQ_GAP_MS - (Date.now() - lastReqAt));
            setTimeout(function () {
                lastReqAt = Date.now();
                fetch(url).then(function (r) {
                    if (r.status === 429 && retries > 0) {
                        // backed off the rate limiter — wait extra and retry
                        return new Promise(function (res) {
                            setTimeout(function () { res(throttledFetch(url, retries - 1)); }, REQ_GAP_MS * 2);
                        });
                    }
                    return r.ok ? r.json() : null;
                }).then(resolve).catch(function () { resolve(null); });
            }, wait);
        });
    }

    function fetchTeam(id) {
        // eventslast → {results:[...]}, eventsnext → {events:[...]}; run sequentially (throttle).
        return throttledFetch(BASE + '/eventslast.php?id=' + id).then(function (d) {
            const past = (d && d.results) || [];
            return throttledFetch(BASE + '/eventsnext.php?id=' + id).then(function (d2) {
                const next = (d2 && d2.events) || [];
                let evs = past.concat(next);
                if (FRIENDLY_FILTER) evs = evs.filter(function (e) { return e.idLeague === WC_LEAGUE; });
                return evs;
            });
        });
    }

    /* ---------- cache + merge ---------- */

    function loadCache() {
        try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; }
        catch (e) { return {}; }
    }
    function saveCache(c) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch (e) { /* quota */ }
    }
    // How long this team's cache stays fresh, from its own fixtures.
    function teamTtl(events, now) {
        let live = false, nextMs = Infinity;
        (events || []).forEach(function (e) {
            if (isFinished(e)) return;
            const ms = whenMs(e);
            if (!ms) return;
            if (ms <= now) { if (now - ms < LIVE_WINDOW) live = true; }   // kicked off, not yet final
            else if (ms < nextMs) { nextMs = ms; }                       // soonest upcoming
        });
        if (live) return TTL_LIVE;
        const until = nextMs - now;
        if (until < 6 * HOUR) return TTL_SOON;
        if (until < 36 * HOUR) return TTL_NEAR;
        return TTL_IDLE;
    }

    function mergeEvents(cache) {
        const seen = {}, out = [];
        Object.keys(cache).forEach(function (id) {
            (cache[id].events || []).forEach(function (e) {
                if (e && e.idEvent && !seen[e.idEvent]) { seen[e.idEvent] = 1; out.push(e); }
            });
        });
        return out;
    }

    /* ---------- helpers ---------- */

    function hasScore(v) { return v !== '' && v !== null && v !== undefined; }
    function isFinished(e) { return hasScore(e.intHomeScore) && hasScore(e.intAwayScore); }
    function whenMs(e) {
        const t = e.strTimestamp || ((e.dateEvent || '') + 'T' + (e.strTime || '00:00:00'));
        const ms = Date.parse(t);
        return isNaN(ms) ? 0 : ms;
    }
    function fmtKickoff(e) {
        const ms = whenMs(e);
        if (!ms) return e.dateEvent || 'TBC';
        try {
            return new Date(ms).toLocaleString(undefined, {
                weekday: 'short', day: 'numeric', month: 'short',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (x) { return e.dateEvent; }
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function rememberBadge(name, url) {
        if (name && url && !badgeCache[name]) badgeCache[name] = url;
    }
    function badge(name) {
        const u = badgeCache[name];
        return u ? '<img class="wc-badge" src="' + esc(u) + '" alt="" loading="lazy">' : '<span class="wc-badge wc-badge--blank"></span>';
    }

    /* ---------- tables ---------- */

    function computeTables(events) {
        const tables = {};
        Object.keys(GROUPS).forEach(function (g) {
            tables[g] = {};
            GROUPS[g].forEach(function (t) {
                tables[g][t] = { team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 };
            });
        });
        events.forEach(function (e) {
            rememberBadge(e.strHomeTeam, e.strHomeTeamBadge);
            rememberBadge(e.strAwayTeam, e.strAwayTeamBadge);
            const gh = TEAM_GROUP[e.strHomeTeam];
            const ga = TEAM_GROUP[e.strAwayTeam];
            if (!gh || gh !== ga) return;          // group-stage match only
            if (!isFinished(e)) return;
            const H = tables[gh][e.strHomeTeam];
            const A = tables[ga][e.strAwayTeam];
            if (!H || !A) return;
            const hs = parseInt(e.intHomeScore, 10);
            const as = parseInt(e.intAwayScore, 10);
            H.P++; A.P++;
            H.GF += hs; H.GA += as; A.GF += as; A.GA += hs;
            if (hs > as) { H.W++; A.L++; H.Pts += 3; }
            else if (hs < as) { A.W++; H.L++; A.Pts += 3; }
            else { H.D++; A.D++; H.Pts++; A.Pts++; }
        });
        Object.keys(tables).forEach(function (g) {
            Object.keys(tables[g]).forEach(function (t) {
                tables[g][t].GD = tables[g][t].GF - tables[g][t].GA;
            });
        });
        return tables;
    }

    function sortRows(rows) {
        return rows.slice().sort(function (a, b) {
            return b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || a.team.localeCompare(b.team);
        });
    }

    function renderTables(tables) {
        let html = '';
        Object.keys(GROUPS).forEach(function (g) {
            const rows = sortRows(Object.keys(tables[g]).map(function (t) { return tables[g][t]; }));
            html += '<div class="wc-group">';
            html += '<h4 class="wc-group-title">Group ' + g + '</h4>';
            html += '<table class="wc-table"><thead><tr>' +
                '<th class="wc-th-pos">#</th><th class="wc-th-team">Team</th>' +
                '<th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>' +
                '</tr></thead><tbody>';
            rows.forEach(function (r, i) {
                const cls = i < 2 ? 'wc-qual' : (i === 2 ? 'wc-third' : '');
                html += '<tr class="' + cls + '">' +
                    '<td class="wc-th-pos">' + (i + 1) + '</td>' +
                    '<td class="wc-th-team">' + badge(r.team) + '<span>' + esc(r.team) + '</span></td>' +
                    '<td>' + r.P + '</td><td>' + r.W + '</td><td>' + r.D + '</td><td>' + r.L + '</td>' +
                    '<td>' + (r.GD > 0 ? '+' + r.GD : r.GD) + '</td><td class="wc-pts">' + r.Pts + '</td>' +
                    '</tr>';
            });
            html += '</tbody></table></div>';
        });
        return html;
    }

    /* ---------- match lists ---------- */

    function matchRow(e, showResult) {
        const finished = isFinished(e);
        const mid = finished
            ? '<span class="wc-score">' + esc(e.intHomeScore) + ' – ' + esc(e.intAwayScore) + '</span>'
            : '<span class="wc-kotime">' + esc(fmtKickoff(e)) + '</span>';
        const grp = TEAM_GROUP[e.strHomeTeam];
        const tag = (grp && grp === TEAM_GROUP[e.strAwayTeam]) ? '<span class="wc-grouptag">Grp ' + grp + '</span>' : '';
        return '<div class="wc-match">' +
            '<div class="wc-team wc-team--home">' + '<span>' + esc(e.strHomeTeam) + '</span>' + badge(e.strHomeTeam) + '</div>' +
            '<div class="wc-mid">' + mid + tag + '</div>' +
            '<div class="wc-team wc-team--away">' + badge(e.strAwayTeam) + '<span>' + esc(e.strAwayTeam) + '</span></div>' +
            '</div>';
    }

    function renderResults(events) {
        const done = events.filter(isFinished).sort(function (a, b) { return whenMs(b) - whenMs(a); });
        if (!done.length) {
            return '<p class="wc-empty">No matches have been played yet. The tournament kicks off on 11 June 2026! ⚽</p>';
        }
        return done.slice(0, 24).map(function (e) { return matchRow(e, true); }).join('');
    }

    function renderFixtures(events) {
        const up = events.filter(function (e) { return !isFinished(e) && TEAM_GROUP[e.strHomeTeam]; })
            .sort(function (a, b) { return whenMs(a) - whenMs(b); });
        if (!up.length) return '<p class="wc-empty">No upcoming fixtures right now.</p>';
        return up.slice(0, 24).map(function (e) { return matchRow(e, false); }).join('');
    }

    function renderKnockout(events) {
        // Knockout = a match between two teams from different groups (cross-group).
        const ko = events.filter(function (e) {
            const gh = TEAM_GROUP[e.strHomeTeam], ga = TEAM_GROUP[e.strAwayTeam];
            return gh && ga && gh !== ga;
        }).sort(function (a, b) { return whenMs(a) - whenMs(b); });
        if (!ko.length) {
            return '<p class="wc-empty">The knockout stage begins after the group phase (from 28 June). ' +
                'Fixtures will appear here once the qualified teams are known. 🏆</p>';
        }
        return ko.map(function (e) { return matchRow(e, true); }).join('');
    }

    /* ---------- orchestration ---------- */

    function setStatus(msg, isError) {
        const el = document.getElementById('wc-status');
        if (el) {
            el.textContent = msg;
            el.classList.toggle('wc-status--error', !!isError);
        }
    }

    function setLiveStatus(events) {
        const played = events.filter(isFinished).length;
        setStatus('✅ Live · ' + events.length + ' matches loaded · ' + played + ' played · updated ' +
            new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    }

    function paint(events) {
        const t = document.getElementById('wc-tables');
        const r = document.getElementById('wc-results');
        const f = document.getElementById('wc-fixtures');
        const k = document.getElementById('wc-knockout');
        const tables = computeTables(events); // also fills badgeCache
        if (t) t.innerHTML = renderTables(tables);
        if (r) r.innerHTML = renderResults(events);
        if (f) f.innerHTML = renderFixtures(events);
        if (k) k.innerHTML = renderKnockout(events);
    }

    // Team ids in group order, but with featured teams first.
    function teamQueueOrder() {
        const all = Object.keys(TEAM_ID);
        const feat = FEATURED.filter(function (n) { return TEAM_ID[n]; });
        const rest = all.filter(function (n) { return feat.indexOf(n) === -1; });
        return feat.concat(rest).map(function (n) { return TEAM_ID[n]; });
    }

    function refresh(force) {
        if (refreshing) return;
        const cache = loadCache();

        // 1) paint whatever we already have, instantly.
        const initial = mergeEvents(cache);
        if (initial.length) paint(initial);

        // 2) work out which teams are stale (or all, if forced).
        const now = Date.now();
        const queue = teamQueueOrder().filter(function (id) {
            const c = cache[id];
            if (force || !c || !c.events) return true;
            return (now - c.t) > teamTtl(c.events, now);
        });

        if (!queue.length) {
            setLiveStatus(initial);
            return;
        }

        // 3) fetch stale teams one at a time, repainting as data arrives.
        refreshing = true;
        const total = queue.length;
        let done = 0;
        if (!initial.length) setStatus('Loading live fixtures & results… (this first load takes a minute)');
        else setStatus('Refreshing live data… 0/' + total + ' teams');

        (function step(i) {
            if (i >= queue.length) {
                refreshing = false;
                const merged = mergeEvents(cache);
                paint(merged);
                setLiveStatus(merged);
                return;
            }
            const id = queue[i];
            fetchTeam(id).then(function (evts) {
                // keep previously cached events if this fetch came back empty (e.g. transient 429)
                const prev = (cache[id] && cache[id].events) || [];
                cache[id] = { t: Date.now(), events: (evts && evts.length) ? evts : prev };
                saveCache(cache);
                done++;
                if (done % 4 === 0 || i === queue.length - 1) paint(mergeEvents(cache));
                setStatus('Refreshing live data… ' + done + '/' + total + ' teams');
                step(i + 1);
            });
        })(0);
    }

    /* ---------- wiring ---------- */

    function wireTabs() {
        const tabs = document.querySelectorAll('#wc2026 .wc-tab');
        tabs.forEach(function (btn) {
            btn.addEventListener('click', function () {
                tabs.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                const target = btn.getAttribute('data-wc');
                document.querySelectorAll('#wc2026 .wc-pane').forEach(function (p) {
                    p.classList.toggle('active', p.id === 'wc-' + target);
                });
            });
        });
        const refreshBtn = document.getElementById('wc-refresh');
        if (refreshBtn) refreshBtn.addEventListener('click', function () { refresh(true); });
    }

    function init() {
        wireTabs();
        document.addEventListener('tabchange', function (e) {
            if (e.detail === 'wc2026' && !loaded) {
                loaded = true;
                refresh(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
