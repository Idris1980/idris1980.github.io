(() => {
  document.documentElement.classList.add('js');
  const lugn = matchMedia('(prefers-reduced-motion: reduce)');

  const lager = document.querySelector('.lager');
  const skivor = lager ? [...lager.querySelectorAll(':scope > .skiva')] : [];
  const svepbar = () => lager && getComputedStyle(lager).overflowX === 'auto';

  // Hoppa till ett projekt, både när korten ligger i en hög och när de sveps
  const hoppa = (i) => {
    const s = skivor[i];
    if (!s) return;
    const satt = lugn.matches ? 'auto' : 'smooth';
    if (svepbar()) {
      const vanster = lager.scrollLeft + s.getBoundingClientRect().left - lager.getBoundingClientRect().left
        - parseFloat(getComputedStyle(lager).paddingLeft);
      lager.scrollTo({ left: vanster, behavior: satt });
      const topp = lager.getBoundingClientRect().top;
      if (topp < 0 || topp > innerHeight * 0.4) {
        scrollTo({ top: scrollY + topp - 90, behavior: satt });
      }
      return;
    }
    // Var skivan ligger i flödet, oavsett om den just nu sitter fast
    let y = lager.getBoundingClientRect().top + scrollY;
    for (let j = 0; j < i; j++) {
      y += skivor[j].offsetHeight + parseFloat(getComputedStyle(skivor[j]).marginBottom);
    }
    const stil = getComputedStyle(s);
    scrollTo({ top: y - (stil.position === 'sticky' ? parseFloat(stil.top) : 20), behavior: satt });
  };
  const index = (id) => skivor.findIndex((s) => s.id === id);
  const namn = (id) => {
    const s = document.getElementById(id);
    return s ? s.querySelector('h3').textContent : id;
  };

  // Gör en lista med länkar till projekten, till exempel "LookFirst, Cleanroom och Swapp"
  const lankLista = (ids, och) => {
    const frag = document.createDocumentFragment();
    ids.forEach((id, n) => {
      if (n > 0) frag.append(n === ids.length - 1 ? ` ${och} ` : ', ');
      const a = document.createElement('a');
      a.className = 'streck';
      a.href = '#' + id;
      a.textContent = namn(id);
      a.addEventListener('click', (e) => {
        const i = index(id);
        if (i < 0) return;
        e.preventDefault();
        hoppa(i);
      });
      frag.append(a);
    });
    return frag;
  };

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

  // Klicka på en platta för att se projekten i den
  const info = document.querySelector('.stapel-info');
  if (stapel && info) {
    const plattor = [...stapel.querySelectorAll('.platta')];
    const och = document.documentElement.lang === 'sv' ? 'och' : 'and';
    plattor.forEach((p) => p.addEventListener('click', () => {
      const pa = p.getAttribute('aria-pressed') !== 'true';
      plattor.forEach((q) => q.setAttribute('aria-pressed', String(q === p && pa)));
      stapel.classList.toggle('vald', pa);
      info.textContent = '';
      if (!pa) {
        info.textContent = info.dataset.tips;
        return;
      }
      const rubrik = document.createElement('strong');
      rubrik.textContent = p.textContent + ': ';
      info.append(rubrik, lankLista(p.dataset.p.split(' '), och));
    }));
  }

  // Tekniker som pekar på projekten
  const bevis = document.querySelector('.bevis');
  if (bevis) {
    const ord = [...document.querySelectorAll('.ord')];
    const visa = (o) => {
      ord.forEach((x) => x.classList.toggle('aktiv', x === o));
      bevis.textContent = '';
      const rubrik = document.createElement('strong');
      rubrik.textContent = o.textContent;
      bevis.append(rubrik, ` ${bevis.dataset.finns} `, lankLista(o.dataset.p.split(' '), bevis.dataset.och), '.');
    };
    ord.forEach((o) => {
      o.addEventListener('mouseenter', () => visa(o));
      o.addEventListener('focus', () => visa(o));
      o.addEventListener('click', () => visa(o));
    });
  }

  // Bilderna i projekten ritas fram när de syns
  const ritas = document.querySelectorAll('.skiva article, .projekt-bild');
  if ('IntersectionObserver' in window) {
    const iakttagare = new IntersectionObserver((poster) => {
      for (const post of poster) {
        if (post.isIntersecting) {
          post.target.classList.add('syns');
          iakttagare.unobserve(post.target);
        }
      }
    }, { threshold: 0.3 });
    ritas.forEach((a) => iakttagare.observe(a));
  } else {
    ritas.forEach((a) => a.classList.add('syns'));
  }

  // Lagermätaren och J/K
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
      if (svepbar()) {
        const kant = r.left + parseFloat(getComputedStyle(lager).paddingLeft);
        let basta = Infinity;
        skivor.forEach((s, j) => {
          const d = Math.abs(s.getBoundingClientRect().left - kant);
          if (d < basta) { basta = d; i = j; }
        });
      } else {
        skivor.forEach((s, j) => { if (s.getBoundingClientRect().top <= h * 0.5) i = j; });
      }
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
    const snart = () => {
      if (vantar) return;
      vantar = true;
      requestAnimationFrame(() => { vantar = false; uppdatera(); });
    };
    addEventListener('scroll', snart, { passive: true });
    lager.addEventListener('scroll', snart, { passive: true });
    addEventListener('resize', snart);
    uppdatera();

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
