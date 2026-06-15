const landing    = document.getElementById('landing');
const gallery    = document.getElementById('gallery');
const openBtn    = document.getElementById('openBtn');
const backBtn    = document.getElementById('backBtn');
const title      = document.querySelector('.gallery-title');
const cards      = document.querySelectorAll('.card');

// Slight random tilt per card (like photos spread on a table)
cards.forEach(card => {
    const tilt = (Math.random() * 4 - 2).toFixed(1);
    card.style.setProperty('--rot', tilt + 'deg');
});

// Floating hearts background
(function spawnHearts() {
    const symbols = ['♡', '♥', '✦', '❀', '✿'];
    setInterval(() => {
        const el = document.createElement('span');
        el.className = 'heart';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left     = Math.random() * 100 + 'vw';
        el.style.fontSize = (Math.random() * 1.4 + 0.6) + 'rem';
        const dur = (Math.random() * 9 + 7).toFixed(1);
        el.style.animationDuration = dur + 's';
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }, 700);
})();

// Open gallery
openBtn.addEventListener('click', () => {
    landing.classList.add('fade-out');

    setTimeout(() => {
        landing.style.display = 'none';
        gallery.classList.remove('hidden');

        // Title appears
        requestAnimationFrame(() => {
            title.classList.add('visible');
        });

        // Cards appear with stagger
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), 200 + i * 110);
        });

        // Back button appears after cards
        setTimeout(() => backBtn.classList.add('visible'), 200 + cards.length * 110 + 100);

    }, 500);
});

// ── Modal ────────────────────────────────────────
const modal      = document.getElementById('modal');
const modalImg   = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalClose = document.querySelector('.modal-close');

function openModal(card) {
    modalImg.src       = card.querySelector('img').src;
    modalImg.alt       = card.querySelector('img').alt;
    modalTitle.textContent = card.dataset.title || '';
    modalDesc.textContent  = card.dataset.description || '';
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Spoiler reveal on click, then card click opens modal
document.querySelectorAll('.spoiler').forEach(spoiler => {
    spoiler.addEventListener('click', e => {
        e.stopPropagation();
        spoiler.classList.add('revealed');
        spoiler.closest('.card').classList.add('revealed-card');
    });
});

cards.forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('revealed-card')) openModal(card);
    });
});

// Reset spoilers and modal when going back to landing
// Back to landing
backBtn.addEventListener('click', () => {
    cards.forEach(card => card.classList.remove('visible'));
    document.querySelectorAll('.spoiler').forEach(s => s.classList.remove('revealed'));
    cards.forEach(card => card.classList.remove('revealed-card'));
    closeModal();
    title.classList.remove('visible');
    backBtn.classList.remove('visible');

    setTimeout(() => {
        gallery.classList.add('hidden');
        landing.style.display = 'flex';

        // Double rAF to allow the display:flex to paint before removing fade-out
        requestAnimationFrame(() => requestAnimationFrame(() => {
            landing.classList.remove('fade-out');
        }));
    }, 400);
});
