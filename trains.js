// ==================================================================
// Live train departures from Winchester calling at Shawford
// Data via Huxley2 — a free public wrapper around National Rail Darwin.
// ==================================================================

const TRAINS_FROM = 'WIN';
const TRAINS_TO = 'SHW';
const TRAINS_URL = `https://huxley2.azurewebsites.net/departures/${TRAINS_FROM}/to/${TRAINS_TO}/8`;
const TRAINS_REFRESH_MS = 60000;

class TrainBoard {
    constructor() {
        this.listEl = document.getElementById('trains-list');
        this.statusEl = document.getElementById('trains-status');
        this.refreshBtn = document.getElementById('trains-refresh');
        if (!this.listEl) return;

        this.refreshBtn.addEventListener('click', () => this.refresh(true));
        this.refresh();
        setInterval(() => this.refresh(), TRAINS_REFRESH_MS);
    }

    async refresh(manual = false) {
        if (manual) this.setStatus('Refreshing…');
        try {
            const res = await fetch(TRAINS_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.render(data);
        } catch (err) {
            this.renderError(err);
        }
    }

    render(data) {
        const services = (data && data.trainServices) || [];
        if (services.length === 0) {
            this.listEl.innerHTML = '';
            this.setStatus(data && data.nrccMessages && data.nrccMessages[0]
                ? this.stripHtml(data.nrccMessages[0].value)
                : 'No upcoming trains to Shawford right now.');
            return;
        }

        const now = new Date();
        const updated = `Updated ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        this.setStatus(`${services.length} train${services.length === 1 ? '' : 's'} · ${updated}`);

        this.listEl.innerHTML = services.slice(0, 6).map(s => this.rowHtml(s)).join('');
    }

    rowHtml(s) {
        const dest = (s.destination && s.destination[0] && s.destination[0].locationName) || '—';
        const platform = s.platform || '—';
        const std = s.std || '—';
        const etd = s.etd || '';
        const cancelled = s.isCancelled || etd === 'Cancelled';
        const onTime = etd === 'On time';

        let etdMarkup = '';
        if (cancelled) {
            etdMarkup = `<span class="train-etd cancelled">Cancelled</span>`;
        } else if (onTime) {
            etdMarkup = `<span class="train-etd ontime">On time</span>`;
        } else if (etd === 'Delayed') {
            etdMarkup = `<span class="train-etd delayed">Delayed</span>`;
        } else if (etd && etd !== std) {
            etdMarkup = `<span class="train-etd delayed">Exp ${etd}</span>`;
        } else if (etd) {
            etdMarkup = `<span class="train-etd ontime">${etd}</span>`;
        }

        const rowClass = cancelled ? 'train-row cancelled' : 'train-row';

        return `
            <li class="${rowClass}">
                <div class="train-time-col">
                    <span class="train-std ${cancelled ? 'strike' : ''}">${std}</span>
                    ${etdMarkup}
                </div>
                <div class="train-info-col">
                    <span class="train-dest">${this.escape(dest)}</span>
                    <span class="train-operator">${this.escape(s.operator || '')}</span>
                </div>
                <div class="train-plat-col">
                    <span class="train-plat-label">Plat</span>
                    <span class="train-plat-value">${this.escape(platform)}</span>
                </div>
            </li>
        `;
    }

    renderError(err) {
        this.listEl.innerHTML = '';
        this.setStatus(`⚠️ Could not load live trains (${err.message}). Will retry in a minute.`);
    }

    setStatus(msg) {
        if (this.statusEl) this.statusEl.textContent = msg;
    }

    stripHtml(s) {
        const div = document.createElement('div');
        div.innerHTML = s;
        return div.textContent || div.innerText || '';
    }

    escape(s) {
        return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(() => new TrainBoard(), 100));
} else {
    setTimeout(() => new TrainBoard(), 100);
}
