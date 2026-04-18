// ==================================================================
// School Bus Tracker — Route 44275, Wheelers Travel, Westgate School
// Timetable data from Hampshire County Council.
// ==================================================================

const BUS_ROUTE = {
    number: '44275',
    operator: 'Wheelers Travel',
    school: 'The Westgate School'
};

// 24h times. Order = direction of travel.
const STOPS_AM = [
    { name: 'Twyford, Manor Farm Green', time: '07:45' },
    { name: 'Twyford, Post Office',      time: '07:48' },
    { name: 'Twyford, Northfields',      time: '07:50' },
    { name: 'Hockley, Hockley Cottages', time: '07:52' },
    { name: 'The Westgate School',       time: '08:10' }
];

const STOPS_PM = [
    { name: 'The Westgate School',       time: '15:15' },
    { name: 'Hockley, Hockley Cottages', time: '15:33' },
    { name: 'Twyford, Northfields',      time: '15:35' },
    { name: 'Twyford, Post Office',      time: '15:37' },
    { name: 'Twyford, Manor Farm Green', time: '15:40' }
];

// Hampshire term dates — update each academic year.
const SCHOOL_HOLIDAYS = [
    { start: '2025-10-27', end: '2025-10-31', label: 'Autumn half term' },
    { start: '2025-12-22', end: '2026-01-02', label: 'Christmas holiday' },
    { start: '2026-02-16', end: '2026-02-20', label: 'February half term' },
    { start: '2026-04-03', end: '2026-04-17', label: 'Easter holiday' },
    { start: '2026-05-04', end: '2026-05-04', label: 'May Day bank holiday' },
    { start: '2026-05-25', end: '2026-05-29', label: 'May half term' },
    { start: '2026-07-22', end: '2026-09-01', label: 'Summer holiday' }
];

const TRACKER_STOP_AM_KEY = 'busTracker_preferredStopAm';
const TRACKER_STOP_PM_KEY = 'busTracker_preferredStopPm';
const TRACKER_REFRESH_MS = 15000;

class BusTracker {
    constructor() {
        this.statusEl = document.getElementById('bus-status');
        if (!this.statusEl) return;

        this.stopSelectAm = document.getElementById('bus-stop-am');
        this.stopSelectPm = document.getElementById('bus-stop-pm');
        this.amList = document.getElementById('bus-timeline-am');
        this.pmList = document.getElementById('bus-timeline-pm');

        this.preferredStopAm = localStorage.getItem(TRACKER_STOP_AM_KEY) || 'Twyford, Manor Farm Green';
        this.preferredStopPm = localStorage.getItem(TRACKER_STOP_PM_KEY) || 'Twyford, Post Office';

        this.populateStopPicker();
        this.renderTimelines();
        this.tick();
        setInterval(() => this.tick(), TRACKER_REFRESH_MS);
    }

    // ---- Helpers ----
    isoDate(d) {
        const yy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yy}-${mm}-${dd}`;
    }

    schoolStatus(date) {
        const dow = date.getDay();
        if (dow === 0 || dow === 6) return { school: false, reason: 'Weekend — no school bus' };
        const iso = this.isoDate(date);
        for (const h of SCHOOL_HOLIDAYS) {
            if (iso >= h.start && iso <= h.end) return { school: false, reason: h.label };
        }
        return { school: true };
    }

    timeAtDate(hhmm, baseDate) {
        const [h, m] = hhmm.split(':').map(Number);
        const d = new Date(baseDate);
        d.setHours(h, m, 0, 0);
        return d;
    }

    nextSchoolDay(from) {
        const d = new Date(from);
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        while (!this.schoolStatus(d).school) d.setDate(d.getDate() + 1);
        return d;
    }

    formatClock(d) {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    formatFullDate(d) {
        return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    formatCountdown(ms) {
        const s = Math.max(0, Math.round(ms / 1000));
        if (s < 60) return `${s} sec`;
        const m = Math.round(s / 60);
        if (m < 60) return `${m} min`;
        const h = Math.floor(m / 60);
        const rem = m % 60;
        return rem === 0 ? `${h} hr` : `${h} hr ${rem} min`;
    }

    stopsForDirection(dir) {
        return dir === 'AM' ? STOPS_AM : STOPS_PM;
    }

    // ---- UI building ----
    populateStopPicker() {
        const fill = (select, selected) => {
            const names = Array.from(new Set([...STOPS_AM, ...STOPS_PM].map(s => s.name)));
            select.innerHTML = '';
            for (const name of names) {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                if (name === selected) opt.selected = true;
                select.appendChild(opt);
            }
        };
        fill(this.stopSelectAm, this.preferredStopAm);
        fill(this.stopSelectPm, this.preferredStopPm);

        this.stopSelectAm.addEventListener('change', () => {
            this.preferredStopAm = this.stopSelectAm.value;
            localStorage.setItem(TRACKER_STOP_AM_KEY, this.preferredStopAm);
            this.tick();
        });
        this.stopSelectPm.addEventListener('change', () => {
            this.preferredStopPm = this.stopSelectPm.value;
            localStorage.setItem(TRACKER_STOP_PM_KEY, this.preferredStopPm);
            this.tick();
        });
    }

    renderTimelines() {
        const build = (listEl, stops) => {
            listEl.innerHTML = '';
            stops.forEach((s, i) => {
                const li = document.createElement('li');
                li.className = 'bus-stop';
                li.dataset.stop = s.name;
                li.innerHTML = `
                    <span class="bus-stop-dot"></span>
                    <span class="bus-stop-time">${s.time}</span>
                    <span class="bus-stop-name">${s.name}</span>
                    <span class="bus-stop-badge"></span>
                `;
                if (i === stops.length - 1) li.classList.add('bus-stop-last');
                listEl.appendChild(li);
            });
        };
        build(this.amList, STOPS_AM);
        build(this.pmList, STOPS_PM);
    }

    updateTimelineStatuses(now, todayIsSchoolDay) {
        const apply = (listEl, stops, dir) => {
            const myStop = dir === 'AM' ? this.preferredStopAm : this.preferredStopPm;
            const items = Array.from(listEl.children);
            items.forEach((li, i) => {
                li.classList.remove('passed', 'current', 'upcoming', 'my-stop');
                const time = this.timeAtDate(stops[i].time, now);
                if (todayIsSchoolDay) {
                    if (time <= now) li.classList.add('passed');
                    else li.classList.add('upcoming');
                } else {
                    li.classList.add('upcoming');
                }
                if (stops[i].name === myStop) li.classList.add('my-stop');
            });
            // Mark the next upcoming stop as 'current' focus if it's the relevant direction today
            if (todayIsSchoolDay) {
                const hour = now.getHours();
                const activeDir = hour < 12 ? 'AM' : 'PM';
                if (dir === activeDir) {
                    const next = items.findIndex(li => li.classList.contains('upcoming'));
                    if (next >= 0) {
                        items[next].classList.remove('upcoming');
                        items[next].classList.add('current');
                    }
                }
            }
        };
        apply(this.amList, STOPS_AM, 'AM');
        apply(this.pmList, STOPS_PM, 'PM');
    }

    // ---- Main tick ----
    tick() {
        const now = new Date();
        const { school, reason } = this.schoolStatus(now);

        if (!school) {
            this.renderOffDay(now, reason);
            this.updateTimelineStatuses(now, false);
            return;
        }

        const hour = now.getHours();
        const direction = hour < 12 ? 'AM' : 'PM';
        const stops = this.stopsForDirection(direction);
        const preferredForDir = direction === 'AM' ? this.preferredStopAm : this.preferredStopPm;

        const myStop = stops.find(s => s.name === preferredForDir);
        const myDirection = direction;

        if (myStop) {
            const stopTime = this.timeAtDate(myStop.time, now);
            if (stopTime > now) {
                this.renderPending(now, myStop, stopTime, myDirection);
            } else {
                // Already passed today — show status for the rest of the route, else roll to next day
                const lastStop = stops[stops.length - 1];
                const lastTime = this.timeAtDate(lastStop.time, now);
                if (lastTime > now && myDirection === direction) {
                    this.renderPassed(now, myStop, stopTime, stops, direction);
                } else {
                    this.renderRollover(now);
                }
            }
        } else {
            this.renderRollover(now);
        }

        this.updateTimelineStatuses(now, true);
    }

    renderOffDay(now, reason) {
        const nextDay = this.nextSchoolDay(now);
        const daysAway = Math.round((nextDay - new Date(this.isoDate(now))) / 86400000);
        const whenStr = daysAway === 1 ? 'tomorrow' : this.formatFullDate(nextDay);
        this.setStatus({
            time: this.formatClock(now),
            main: `🏖️ ${reason}`,
            sub: `Next school bus: ${whenStr} at 07:45`,
            kind: 'off'
        });
    }

    renderPending(now, stop, stopTime, direction) {
        const ms = stopTime - now;
        const icon = direction === 'AM' ? '🌅' : '🏠';
        const label = direction === 'AM' ? 'Morning pickup' : 'Afternoon drop-off';
        this.setStatus({
            time: this.formatClock(now),
            main: `${icon} ${label} at ${stop.name}`,
            sub: `Bus due at ${stop.time} — in ${this.formatCountdown(ms)}`,
            kind: 'pending'
        });
    }

    renderPassed(now, stop, stopTime, stops, direction) {
        const last = stops[stops.length - 1];
        const lastTime = this.timeAtDate(last.time, now);
        const icon = direction === 'AM' ? '🌅' : '🏠';
        const destinationLabel = direction === 'AM' ? 'arriving at school' : 'finishing route';
        if (lastTime > now) {
            const ms = lastTime - now;
            this.setStatus({
                time: this.formatClock(now),
                main: `${icon} Bus already passed ${stop.name} at ${stop.time}`,
                sub: `${destinationLabel} at ${last.time} — in ${this.formatCountdown(ms)}`,
                kind: 'passed'
            });
        } else {
            this.renderRollover(now);
        }
    }

    renderRollover(now) {
        // Determine the next relevant service today (if any) or tomorrow's AM
        const amFirst = this.timeAtDate(STOPS_AM[0].time, now);
        const pmFirst = this.timeAtDate(STOPS_PM[0].time, now);
        let nextLabel, nextTime;
        if (amFirst > now) { nextLabel = 'morning pickup'; nextTime = amFirst; }
        else if (pmFirst > now) { nextLabel = 'afternoon drop-off'; nextTime = pmFirst; }
        else {
            const nextDay = this.nextSchoolDay(now);
            nextLabel = 'tomorrow\u2019s morning pickup';
            nextTime = this.timeAtDate(STOPS_AM[0].time, nextDay);
        }
        this.setStatus({
            time: this.formatClock(now),
            main: `✅ Today\u2019s service complete`,
            sub: `Next ${nextLabel} at ${this.formatClock(nextTime)}`,
            kind: 'complete'
        });
    }

    setStatus({ time, main, sub, kind }) {
        this.statusEl.dataset.kind = kind;
        this.statusEl.querySelector('.bus-status-time').textContent = time;
        this.statusEl.querySelector('.bus-status-main').textContent = main;
        this.statusEl.querySelector('.bus-status-sub').textContent = sub;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new BusTracker(), 100));
} else {
    setTimeout(() => new BusTracker(), 100);
}
