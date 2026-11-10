(() => {
  document.documentElement.classList.add('js');
  const lugn = matchMedia('(prefers-reduced-motion: reduce)');

  // Stapeln följer pekaren
  const intro = document.querySelector('.intro');
  const stapel = document.querySelector('.stapel');
  if (intro && stapel && matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, x = 0, y = 0, igang = false;
    const steg = () => {
      x += (mx - x) * 0.08;
      y += (my - y) * 0.08;
      stapel.style.setProperty('--tx', (x * 12).toFixed(2) + 'deg');
      stapel.style.setProperty('--ty', (y * -8).toFixed(2) + 'deg');
      if (Math.abs(mx - x) > 0.002 || Math.abs(my - y) > 0.002) {
        requestAnimationFrame(steg);
      } else {
        igang = false;
      }
    };
    addEventListener('pointermove', (e) => {
      if (lugn.matches || scrollY > intro.offsetTop + intro.offsetHeight) return;
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
      if (!igang) { igang = true; requestAnimationFrame(steg); }
    }, { passive: true });
  }

  // Bilderna i projekten ritas fram när de syns
  const artiklar = document.querySelectorAll('.skiva article');
  if ('IntersectionObserver' in window) {
    const iakttagare = new IntersectionObserver((poster) => {
      for (const post of poster) {
        if (post.isIntersecting) {
          post.target.classList.add('syns');
          iakttagare.unobserve(post.target);
        }
      }
    }, { threshold: 0.3 });
    artiklar.forEach((a) => iakttagare.observe(a));
  } else {
    artiklar.forEach((a) => a.classList.add('syns'));
  }

  // Lagermätaren och J/K
  const lager = document.querySelector('.lager');
  const skivor = lager ? [...lager.querySelectorAll(':scope > .skiva')] : [];
  const matare = document.querySelector('.matare');
  if (lager && skivor.length && matare) {
    const lankar = [...matare.querySelectorAll('a')];
    const nr = matare.querySelector('.matare-nr');
    const titel = matare.querySelector('.matare-titel');
    let aktiv = -1;

    const uppdatera = () => {
      const h = innerHeight;
      const r = lager.getBoundingClientRect();
      matare.classList.toggle('synlig', r.top < h * 0.6 && r.bottom > h * 0.45);
      let i = 0;
      skivor.forEach((s, j) => { if (s.getBoundingClientRect().top <= h * 0.5) i = j; });
      if (i === aktiv) return;
      aktiv = i;
      lankar.forEach((a, j) => {
        if (j === i) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      nr.textContent = String(i + 1).padStart(2, '0');
      titel.textContent = skivor[i].querySelector('h3').textContent;
    };

    let vantar = false;
    addEventListener('scroll', () => {
      if (vantar) return;
      vantar = true;
      requestAnimationFrame(() => { vantar = false; uppdatera(); });
    }, { passive: true });
    addEventListener('resize', uppdatera);
    uppdatera();

    // Var skivan ligger i flödet, oavsett om den just nu sitter fast
    const malPunkt = (i) => {
      let y = lager.getBoundingClientRect().top + scrollY;
      for (let j = 0; j < i; j++) {
        y += skivor[j].offsetHeight + parseFloat(getComputedStyle(skivor[j]).marginBottom);
      }
      const stil = getComputedStyle(skivor[i]);
      return y - (stil.position === 'sticky' ? parseFloat(stil.top) : 20);
    };
    const hoppa = (i) => {
      scrollTo({ top: malPunkt(i), behavior: lugn.matches ? 'auto' : 'smooth' });
    };

    lankar.forEach((a, i) => a.addEventListener('click', (e) => {
      e.preventDefault();
      hoppa(i);
    }));

    addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
      const k = e.key.toLowerCase();
      if (k !== 'j' && k !== 'k') return;
      const fore = lager.getBoundingClientRect().top > innerHeight * 0.5;
      const mal = fore ? (k === 'j' ? 0 : -1) : aktiv + (k === 'j' ? 1 : -1);
      if (mal < 0 || mal >= skivor.length) return;
      e.preventDefault();
      hoppa(mal);
    });
  }

  // Kopiera mejladressen
  const knapp = document.querySelector('.kopiera');
  if (knapp && navigator.clipboard && window.isSecureContext) {
    knapp.hidden = false;
    const text = knapp.textContent;
    let timer;
    knapp.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(knapp.dataset.adress);
        knapp.textContent = knapp.dataset.klar;
        knapp.classList.add('klar');
      } catch {
        knapp.textContent = knapp.dataset.fel;
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        knapp.textContent = text;
        knapp.classList.remove('klar');
      }, 2200);
    });
  }
})();
