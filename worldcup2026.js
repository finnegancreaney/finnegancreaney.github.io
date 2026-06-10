/* World Cup 2026 — live fixtures, results and group tables.
 * Data: TheSportsDB free public key "3" (no account needed).
 * The group stage is rounds 1-3 (72 matches); knockout rounds populate later.
 * Group letters are the official 2026 draw, with names aligned to TheSportsDB's
 * exact spellings (verified against the live fixture list). */
(function () {
    'use strict';

    const KEY = '3';
    const LEAGUE = 4429;            // FIFA World Cup
    const SEASON = '2026';
    const GROUP_ROUNDS = [1, 2, 3];
    // Candidate knockout round codes — silently ignored until TheSportsDB fills them in.
    const KO_ROUNDS = [125, 150, 160, 170, 180, 200];
    const CACHE_KEY = 'wc2026_cache_v1';
    const CACHE_MS = 10 * 60 * 1000; // 10 minutes

    // Official 2026 group draw (TheSportsDB spellings).
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
    const TEAM_GROUP = {};
    Object.keys(GROUPS).forEach(function (g) {
        GROUPS[g].forEach(function (t) { TEAM_GROUP[t] = g; });
    });

    let loaded = false;
    let badgeCache = {}; // team name -> badge url

    /* ---------- data ---------- */

    function fetchRound(round) {
        const url = 'https://www.thesportsdb.com/api/v1/json/' + KEY +
            '/eventsround.php?id=' + LEAGUE + '&r=' + round + '&s=' + SEASON;
        return fetch(url)
            .then(function (r) { return r.ok ? r.json() : { events: null }; })
            .then(function (d) { return (d && d.events) || []; })
            .catch(function () { return []; });
    }

    function fetchAll(force) {
        if (!force) {
            try {
                const c = JSON.parse(localStorage.getItem(CACHE_KEY));
                if (c && (Date.now() - c.t) < CACHE_MS && c.events && c.events.length) {
                    return Promise.resolve(c.events);
                }
            } catch (e) { /* ignore */ }
        }
        const rounds = GROUP_ROUNDS.concat(KO_ROUNDS);
        return Promise.all(rounds.map(fetchRound)).then(function (lists) {
            const events = [].concat.apply([], lists);
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), events: events }));
            } catch (e) { /* quota */ }
            return events;
        });
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
        const played = events.filter(isFinished).length;
        setStatus('✅ Live · ' + events.length + ' matches loaded · ' + played + ' played · updated ' +
            new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    }

    function load(force) {
        setStatus('Loading live fixtures & results…');
        fetchAll(force).then(function (events) {
            if (!events.length) {
                setStatus('⚠️ Couldn’t reach the live data right now. Please try Refresh in a moment.', true);
                return;
            }
            paint(events);
        }).catch(function () {
            setStatus('⚠️ Couldn’t load World Cup data right now. Please try Refresh in a moment.', true);
        });
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
        const refresh = document.getElementById('wc-refresh');
        if (refresh) refresh.addEventListener('click', function () { load(true); });
    }

    function init() {
        wireTabs();
        document.addEventListener('tabchange', function (e) {
            if (e.detail === 'wc2026' && !loaded) {
                loaded = true;
                load(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
