# Hemsida

Min personliga sida med projekten jag har byggt. Vanlig HTML och CSS med lite egen JavaScript, inget byggsteg och inget som hämtas från andra sajter.

- `index.html` – svenska
- `en/index.html` – engelska
- `style.css` – gemensam stil, mörk
- `sida.js` – stapeln, lagermätaren, J/K, teknikerna som pekar på projekten och kopiera-knappen. Sidan fungerar även utan den
- `projekt/` och `en/projects/` – en sida per projekt. Skapas med `node verktyg/projektsidor.mjs`, som hämtar namn, bild och länkar från startsidorna. Kör skriptet igen efter ändringar där
- `cv/` och `en/cv/` – CV:t som webbsida. PDF:en bredvid görs av samma sida med `node verktyg/cv-pdf.mjs` (kräver Microsoft Edge). Kör skriptet igen efter ändringar i CV:t
- `typsnitt/` – Familjen Grotesk (SIL Open Font License, licensen ligger bredvid)
- `.nojekyll` – GitHub Pages ska visa filerna som de är

Sidan ligger på GitHub Pages. Egen domän läggs i filen `CNAME`.

Titta lokalt genom att öppna `index.html` i webbläsaren.
