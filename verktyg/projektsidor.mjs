// Bygger en egen sida för varje projekt, på svenska och engelska.
// Namn, flödesbild, status, länkar och teknik hämtas från startsidorna,
// så de behöver bara ändras där. Texten om varje projekt står längre ner.
// Kör från mappen hemsida:  node verktyg/projektsidor.mjs

import fs from "node:fs";
import path from "node:path";

const rot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

const text = [
  {
    sv: {
      varfor: [
        "Kod från en AI, ett forum eller en guide fungerar ofta, och gör ofta mer än man tror. Den kan öppna servern mot hela internet, skriva lösenord i filer, ladda ner och köra andra skript eller starta sig själv varje gång man loggar in.",
        "LookFirst läser koden utan att köra den och visar vad den skulle bygga innan något händer.",
      ],
      hur: [
        "<strong>Läser utan att köra.</strong> Terraform, Bicep, CloudFormation och skript granskas som text, så inget skapas och inget kostar.",
        "<strong>Ritar vad som byggs.</strong> Nätverk och undernät blir ramar med servrarna inuti, som på Microsofts och Amazons egna diagram.",
        "<strong>Steg för steg.</strong> Varje skript i den ordning det skulle köras, med riskerna direkt under varje steg.",
        "<strong>Förklarar varför det spelar roll.</strong> Varje fynd säger vad som kan hända och hur man rättar det, med länk till Microsofts eller Amazons egna säkerhetsråd.",
        "<strong>Fångar påhittade resurser.</strong> Varje resurstyp kontrolleras mot Microsofts och Amazons egna listor, som uppdateras varje vecka.",
        "<strong>Koden stannar hos dig.</strong> Webbversionen körs helt i webbläsaren och skickar inte koden någonstans.",
      ],
    },
    en: {
      varfor: [
        "Code from an AI, a forum or a tutorial often works, and often does more than you think. It can open the server to the whole internet, write passwords into files, download and run other scripts, or start itself every time you log in.",
        "LookFirst reads the code without running it and shows what it would build before anything happens.",
      ],
      hur: [
        "<strong>Reads without running.</strong> Terraform, Bicep, CloudFormation and scripts are reviewed as text, so nothing is created and nothing costs money.",
        "<strong>Draws what gets built.</strong> Networks and subnets become frames with the servers inside, as on Microsoft's and Amazon's own diagrams.",
        "<strong>Step by step.</strong> Every script in the order it would run, with the risks right under each step.",
        "<strong>Explains why it matters.</strong> Every finding says what could happen and how to fix it, with a link to Microsoft's or Amazon's own security guidance.",
        "<strong>Catches made-up resources.</strong> Every resource type is checked against Microsoft's and Amazon's own lists, refreshed every week.",
        "<strong>Your code stays with you.</strong> The web version runs entirely in the browser and doesn't send the code anywhere.",
      ],
    },
  },
  {
    sv: {
      varfor: [
        "Hyresvärdar och bostadsrättsföreningar behöver en plats där de boende kan sköta sina ärenden och där personalen kan hålla ordning på dem.",
        "Portalen är byggd så att varje kund får en helt egen miljö. Ingen kund delar databas eller inloggning med någon annan.",
      ],
      hur: [
        "<strong>För de boende.</strong> Felanmälan, bokning av tvättid, avier och dokument.",
        "<strong>För personalen.</strong> Ärenden, bostadskö, roller och behörigheter.",
        "<strong>En miljö per kund.</strong> Egen Azure-miljö med egen inloggning via Entra External ID, egna färger och egen logga.",
        "<strong>Hemligheter i Key Vault.</strong> Nycklar och lösenord förvaras i Azure Key Vault.",
        "<strong>Kopplas till andra system.</strong> API och webhooks.",
        "<strong>Spårbart.</strong> Revisionslogg och GDPR-export, och allt sätts upp med skript och ARM-mallar.",
      ],
    },
    en: {
      varfor: [
        "Landlords and housing cooperatives need one place where residents can handle their errands and staff can keep track of them.",
        "The portal is built so that every customer gets a completely separate environment. No customer shares a database or sign-in with anyone else.",
      ],
      hur: [
        "<strong>For residents.</strong> Fault reports, laundry booking, invoices and documents.",
        "<strong>For staff.</strong> Cases, a housing queue, roles and permissions.",
        "<strong>One environment per customer.</strong> A separate Azure environment with its own sign-in through Entra External ID, its own colours and its own logo.",
        "<strong>Secrets in Key Vault.</strong> Keys and passwords are kept in Azure Key Vault.",
        "<strong>Connects to other systems.</strong> An API and webhooks.",
        "<strong>Traceable.</strong> An audit log and GDPR export, and everything is deployed with scripts and ARM templates.",
      ],
    },
  },
  {
    sv: {
      varfor: [
        "En utvecklare som behöver en riktig databas att testa mot har oftast två dåliga val: öppna en databas mot internet \"bara en stund\", eller vänta i dagar på att någon sätter upp en miljö, ett VPN och behörigheter.",
        "Cleanroom ger varje utvecklare en egen privat sandlåda som går att förstöra och slänga när jobbet är klart.",
      ],
      hur: [
        "<strong>cleanroom up</strong> skapar en isolerad Azure-miljö med en SQL-databas som inte går att nå från internet. Den är klar på runt fem minuter.",
        "<strong>cleanroom connect</strong> öppnar en privat tunnel från datorn till databasen via Azure Relay. Båda sidor ringer ut, så ingen port behöver öppnas.",
        "<strong>Inga lösenord eller nycklar.</strong> Man loggar in med sitt vanliga konto i Entra ID.",
        "<strong>Privat nätverk.</strong> Databasen nås bara genom en privat anslutning, och den publika åtkomsten är avstängd.",
        "<strong>cleanroom down</strong> tar bort allt igen, även kostnaden.",
      ],
    },
    en: {
      varfor: [
        "A developer who needs a real database to test against usually has two bad options: open a database to the internet \"just for a while\", or wait days for someone to set up an environment, a VPN and permissions.",
        "Cleanroom gives every developer a private sandbox they can break freely and throw away when the work is done.",
      ],
      hur: [
        "<strong>cleanroom up</strong> creates an isolated Azure environment with a SQL database that can't be reached from the internet. It's ready in about five minutes.",
        "<strong>cleanroom connect</strong> opens a private tunnel from your machine to the database over Azure Relay. Both sides dial out, so no port has to be opened.",
        "<strong>No passwords or keys.</strong> You sign in with your normal Entra ID account.",
        "<strong>Private network.</strong> The database is only reachable through a private endpoint, with public access turned off.",
        "<strong>cleanroom down</strong> removes everything again, including the cost.",
      ],
    },
  },
  {
    sv: {
      varfor: [
        "När en appnyckel går ut, eller när personen som loggade in en koppling slutar, slutar integrationer att fungera. Ofta utan att någon märker det förrän något har gått sönder.",
        "Bäst före visar vad som är på väg att sluta fungera, medan det fortfarande finns tid att byta.",
      ],
      hur: [
        "<strong>Nycklar och certifikat som går ut</strong> i appregistreringar och företagsappar, indelade efter hur bråttom det är: trasigt nu, inom 14 dagar och inom 60 dagar.",
        "<strong>Appar utan ägare.</strong> Appar som fortfarande fungerar men där ingen kommer att byta nyckeln.",
        "<strong>Kopplingar i Logic Apps</strong> som är inloggade med en persons konto, i alla prenumerationer man kan se.",
        "<strong>Den vanliga fällan.</strong> Varnar även när en app har både en gammal och en ny nyckel, eftersom någon kanske aldrig bytte i klienten.",
        "<strong>Läser bara.</strong> Verktyget ser aldrig själva hemligheterna, bara namn, slutdatum och vem som är inloggad.",
      ],
    },
    en: {
      varfor: [
        "When an app secret expires, or when the person who signed in a connection leaves, integrations stop working. Often nobody notices until something has broken.",
        "Bäst före (Swedish for \"best before\") shows what's about to stop working while there's still time to change it.",
      ],
      hur: [
        "<strong>Expiring secrets and certificates</strong> in app registrations and enterprise apps, grouped by urgency: broken now, within 14 days and within 60 days.",
        "<strong>Apps without an owner.</strong> Apps that still work but where nobody will rotate the key.",
        "<strong>Logic Apps connections</strong> signed in with a person's account, across every subscription you can see.",
        "<strong>The common trap.</strong> Also warns when an app has both an old and a new key, since someone may never have switched the client.",
        "<strong>Read only.</strong> The tool never sees the secrets themselves, only names, expiry dates and who is signed in.",
      ],
    },
  },
  {
    sv: {
      varfor: [
        "Det är lätt att inte märka hur mycket tid som går i sociala appar. En siffra i minuter säger inte så mycket, men en promenad eller ett kapitel i en bok gör det.",
        "Swapp visar tiden som något man känner igen, och den gör det utan att något om dig lämnar telefonen.",
      ],
      hur: [
        "<strong>Räknar tiden</strong> du har varit i sociala appar under dagen.",
        "<strong>Översätter den</strong> till vad samma tid hade räckt till, till exempel en promenad eller ett bokkapitel.",
        "<strong>Dagsmål</strong> för tiden i sociala appar.",
        "<strong>En mjuk pausruta</strong> som påminner om tiden.",
        "<strong>En widget</strong> på hemskärmen.",
        "<strong>Ingen internetbehörighet alls.</strong> Ingenting kan lämna telefonen.",
      ],
      extra: '<p>Läs exakt vad appen läser och sparar i <a class="streck" href="../../swapp/integritet/">integritetspolicyn</a>.</p>',
    },
    en: {
      varfor: [
        "It's easy not to notice how much time goes into social apps. A number of minutes doesn't say much, but a walk or a chapter of a book does.",
        "Swapp shows the time as something you recognise, and it does so without anything about you leaving the phone.",
      ],
      hur: [
        "<strong>Counts the time</strong> you've spent in social apps during the day.",
        "<strong>Translates it</strong> into what the same time could have been, like a walk or a book chapter.",
        "<strong>Daily goals</strong> for time in social apps.",
        "<strong>A gentle pause screen</strong> as a reminder.",
        "<strong>A widget</strong> on the home screen.",
        "<strong>No internet permission at all.</strong> Nothing can leave the phone.",
      ],
      extra: '<p>See exactly what the app reads and stores in the <a class="streck" href="../../../swapp/privacy/">privacy policy</a>.</p>',
    },
  },
  {
    sv: {
      varfor: [
        "De flesta verktyg som gör PDF av Markdown bryter långa kommandon vid sidkanten. Kopierar man kommandot följer radbrytningen med, och terminalen kör halva kommandot.",
        "Jag behövde PDF:er där kommandona går att kopiera och klistra in utan att något går sönder, så jag byggde ett tillägg där varje kodrad går att kopiera exakt som den står.",
      ],
      hur: [
        "<strong>Delar långa kommandon rätt.</strong> Backtick för PowerShell, backslash för bash och ^ för cmd, före parametrarna så att varje parameter stannar ihop med sitt värde.",
        "<strong>Krymper det som inte går att dela.</strong> YAML, JSON och långa citat skrivs ut i lagom mindre stil så att varje rad får plats.",
        "<strong>Varnar medan du skriver.</strong> Rader som kommer att delas eller inte får plats markeras direkt i editorn.",
        "<strong>Kontrollerar efteråt.</strong> Den färdiga PDF:en läses med PDFium, samma motor som Edge och Chrome använder när man kopierar, och rader som inte går att kopiera hela markeras.",
        "<strong>Mermaid utan internet.</strong> Diagrammen ritas med en kopia som följer med tillägget.",
        "<strong>Signerade versioner.</strong> Finns på Visual Studio Marketplace och som signerade filer på GitHub.",
      ],
    },
    en: {
      varfor: [
        "Most tools that turn Markdown into PDF break long commands at the page edge. When you copy the command, the line break comes along and the terminal runs half a command.",
        "I needed PDFs where commands can be copied and pasted without breaking, so I built an extension where every code line can be copied exactly as written.",
      ],
      hur: [
        "<strong>Splits long commands correctly.</strong> A backtick for PowerShell, a backslash for bash and ^ for cmd, before the parameters so each parameter stays with its value.",
        "<strong>Shrinks what can't be split.</strong> YAML, JSON and long quoted strings are printed just small enough for every line to fit.",
        "<strong>Warns while you type.</strong> Lines that will be split or won't fit are marked right in the editor.",
        "<strong>Checks afterwards.</strong> The finished PDF is read with PDFium, the same engine Edge and Chrome use when you copy, and lines that can't be copied in full are flagged.",
        "<strong>Mermaid offline.</strong> Diagrams are drawn with a copy that ships with the extension.",
        "<strong>Signed releases.</strong> On the Visual Studio Marketplace and as signed files on GitHub.",
      ],
    },
  },
];

// Bilder per projekt, i samma ordning som projekten. Filerna ligger i mappen bilder/.
// telefon: true ställer bilderna bredvid varandra, för skärmdumpar från en mobil.
const bilder = [
  { bilder: [
    { fil: "lookfirst-bild.webp", b: 1200, h: 700, sv: "Rapporten börjar med en bild av vad koden skulle bygga. Här öppnar en CloudFormation-mall en webbserver mot hela internet.", en: "The report starts with a picture of what the code would build. Here a CloudFormation template opens a web server to the whole internet." },
    { fil: "lookfirst-steg.webp", b: 1200, h: 580, sv: "Steg för steg: varje skript i den ordning det skulle köras, med riskerna under varje steg.", en: "Step by step: every script in the order it would run, with the risks under each step." },
    { fil: "lookfirst-kort.webp", b: 1200, h: 640, sv: "Klickar man på en ruta visas raden i koden, riskerna och hur man rättar dem.", en: "Clicking a box shows the line of code, the risks and how to fix them." },
  ] },
  { bilder: [
    { fil: "boendeportalen-boende.webp", b: 1600, h: 1025, sv: "De boendes startsida hos demokunden Hellas Bostäder. Alla namn och uppgifter är påhittade.", en: "The residents' home page for the demo customer Hellas Bostäder. All names and details are made up." },
    { fil: "boendeportalen-personal.webp", b: 1600, h: 1025, sv: "Personalens översikt med uthyrning, försenade avier och det som väntar.", en: "The staff overview with lettings, late invoices and what's waiting." },
  ] },
  { bilder: [
    { fil: "cleanroom-up.webp", b: 543, h: 272, sv: "cleanroom up bygger hela miljön i Azure. Den här gången tog det 5 minuter och 12 sekunder.", en: "cleanroom up builds the whole environment in Azure. This time it took 5 minutes and 12 seconds." },
    { fil: "cleanroom-resurser.webp", b: 915, h: 567, sv: "Det som skapas: databas, privat nätverk, private endpoint, Relay och en liten container som håller tunneln.", en: "What gets created: a database, a private network, a private endpoint, Relay and a small container that holds the tunnel." },
    { fil: "cleanroom-stangd.webp", b: 934, h: 357, sv: "Beviset i Azure-portalen: databasservern är helt stängd för internet.", en: "The proof in the Azure portal: the database server is completely closed to the internet." },
    { fil: "cleanroom-connect.webp", b: 940, h: 152, sv: "cleanroom connect öppnar tunneln från datorn.", en: "cleanroom connect opens the tunnel from the computer." },
    { fil: "cleanroom-sql.webp", b: 915, h: 209, sv: "Genom tunneln svarar databasen, fast den inte går att nå från internet.", en: "Through the tunnel the database answers, even though it can't be reached from the internet." },
    { fil: "cleanroom-down.webp", b: 772, h: 99, sv: "cleanroom down tar bort allt igen, och status visar att inget ligger kvar och kostar pengar.", en: "cleanroom down removes everything again, and status shows that nothing is left costing money." },
  ] },
  { bilder: [
    { fil: "bast-fore-appar.webp", b: 960, h: 600, sv: "Rapporten delar in apparna efter hur bråttom det är. Här från demoläget, med en påhittad tenant.", en: "The report groups the apps by urgency. Shown here from demo mode, with a made-up tenant." },
    { fil: "bast-fore-kopplingar.webp", b: 960, h: 700, sv: "Kopplingar i Logic Apps som hänger på en person, eller på ett konto som redan är borta.", en: "Logic Apps connections that depend on one person, or on an account that's already gone." },
  ] },
  { telefon: true, bilder: [
    { fil: "swapp-min-tid.webp", b: 600, h: 1175, sv: "Dagens tid mot dagsmålet, och vad den hade räckt till.", en: "Today's time against the daily goal, and what it could have been." },
    { fil: "swapp-hellre.webp", b: 600, h: 1175, sv: "Saker man hellre vill göra, med hur lång tid de tar.", en: "Things you'd rather do, with how long they take." },
    { fil: "swapp-paus.webp", b: 600, h: 1175, sv: "Pausrutan föreslår något annat att göra.", en: "The pause screen suggests something else to do." },
  ] },
  { bilder: [
    { fil: "copyable-pdf-exempel.webp", b: 1190, h: 800, sv: "En PDF från tillägget. De långa kommandona är delade med ` för PowerShell och \\ för bash, och diagrammet är ritat utan internet.", en: "A PDF from the extension. The long commands are split with ` for PowerShell and \\ for bash, and the diagram is drawn offline." },
  ] },
];

const sprak = {
  sv: {
    start: "index.html", mapp: "projekt", lang: "sv", annat: "en",
    alla: "Alla projekt", kontakt: "Kontakt", byt: "English",
    varfor: "Varför", hur: "Så fungerar den", byggd: "Byggd med", bildRubrik: "Bilder",
    nasta: "Nästa projekt", tillbaka: "← Alla projekt",
  },
  en: {
    start: "en/index.html", mapp: "en/projects", lang: "en", annat: "sv",
    alla: "All projects", kontakt: "Contact", byt: "Svenska",
    varfor: "Why", hur: "How it works", byggd: "Built with", bildRubrik: "Pictures",
    nasta: "Next project", tillbaka: "← All projects",
  },
};

const hamta = (html) => {
  const ut = [];
  const re = /<li class="skiva (s\d)" id="([^"]+)"><article>([\s\S]*?)<\/article><\/li>/g;
  let m;
  while ((m = re.exec(html))) {
    const [, klass, id, inre] = m;
    const ett = (r) => (inre.match(r) || [])[1] || "";
    ut.push({
      klass, id,
      nummer: ett(/<span class="nummer">([^<]*)<\/span>/),
      status: ett(/<span class="status">([^<]*)<\/span>/),
      namn: ett(/<h3>([^<]*)<\/h3>/),
      rubrik: ett(/<p class="rubrik-text">([^<]*)<\/p>/),
      svg: (inre.match(/<svg class="flode"[\s\S]*?<\/svg>/) || [""])[0],
      teknik: ett(/<p class="teknik">([^<]*)<\/p>/).split(" / ").map((t) => t.trim()).filter(Boolean),
      vagar: ett(/<p class="vagar">([\s\S]*?)<\/p>/).replace(/<a class="streck las-mer"[^>]*>[^<]*<\/a>\s*/, ""),
    });
  }
  return ut;
};

const sv = hamta(fs.readFileSync(path.join(rot, "index.html"), "utf8"));
const en = hamta(fs.readFileSync(path.join(rot, "en/index.html"), "utf8"));
if (sv.length !== 6 || en.length !== 6) throw new Error(`Hittade ${sv.length} och ${en.length} projekt, väntade 6 och 6`);

const sida = (k, lista, andra, i) => {
  const p = lista[i];
  const t = text[i][k.lang];
  const nasta = lista[(i + 1) % lista.length];
  const upp = k.lang === "sv" ? "../../" : "../../../";
  const andraHref = k.lang === "sv" ? `../../en/projects/${andra[i].id}/` : `../../../projekt/${andra[i].id}/`;
  const startHref = k.lang === "sv" ? "../../" : "../../";
  const bildHtml = bilder[i].bilder.length
    ? `
    <section class="projekt-del">
      <h2 class="etikett">${k.bildRubrik}</h2>
      <div class="bilder${bilder[i].telefon ? " telefon" : ""}">
${bilder[i].bilder.map((b) => `        <figure><img src="${upp}bilder/${b.fil}" width="${b.b}" height="${b.h}" alt="${b[k.lang]}" loading="lazy" decoding="async"><figcaption>${b[k.lang]}</figcaption></figure>`).join("\n")}
      </div>
    </section>
`
    : "";
  return `<!doctype html>
<html lang="${k.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="theme-color" content="#141413">
  <title>${p.namn} – Idris Altun</title>
  <meta name="description" content="${p.rubrik}">
  <link rel="icon" href="${upp}favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${upp}typsnitt/familjen-grotesk.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${upp}style.css">
  <link rel="alternate" hreflang="${k.annat}" href="${andraHref}">
  <script src="${upp}sida.js" defer></script>
</head>
<body>
<div class="sida">

  <header class="topp">
    <a class="namn" href="${startHref}">Idris Altun</a>
    <nav>
      <a href="${startHref}#${p.id}">${k.alla}</a>
      <a href="${startHref}#${k.lang === "sv" ? "kontakt" : "contact"}">${k.kontakt}</a>
      <a href="${andraHref}" lang="${k.annat}">${k.byt}</a>
    </nav>
  </header>

  <main class="projektsida ${p.klass}">
    <article class="projekt-kort">
      <div class="skiva-topp"><a class="tillbaka streck" href="${startHref}#${p.id}">${k.tillbaka}</a><span class="status">${p.status}</span></div>
      <p class="nummer">${p.nummer}</p>
      <h1>${p.namn}</h1>
      <p class="rubrik-text">${p.rubrik}</p>
      <p class="vagar">${p.vagar}</p>
    </article>

    <section class="projekt-del projekt-varfor">
      <div class="projekt-bild">
        ${p.svg}
      </div>
      <div>
        <h2 class="etikett">${k.varfor}</h2>
${t.varfor.map((s) => `        <p>${s}</p>`).join("\n")}
${t.extra ? `        ${t.extra}\n` : ""}      </div>
    </section>
${bildHtml}
    <section class="projekt-del">
      <h2 class="etikett">${k.hur}</h2>
      <ol class="punkter">
${t.hur.map((s) => `        <li>${s}</li>`).join("\n")}
      </ol>
    </section>

    <section class="projekt-del">
      <h2 class="etikett">${k.byggd}</h2>
      <ul class="chips">
${p.teknik.map((s) => `        <li>${s}</li>`).join("\n")}
      </ul>
    </section>

    <nav class="nasta ${nasta.klass}" aria-label="${k.nasta}">
      <a href="../${nasta.id}/"><span>${k.nasta}</span><strong>${nasta.namn} →</strong></a>
    </nav>
  </main>

  <footer class="sidfot">
    <span>Idris Altun</span>
    <span>idrisaltun.com</span>
  </footer>
</div>
</body>
</html>
`;
};

let antal = 0;
for (const [k, lista, andra] of [[sprak.sv, sv, en], [sprak.en, en, sv]]) {
  lista.forEach((p, i) => {
    const mapp = path.join(rot, k.mapp, p.id);
    fs.mkdirSync(mapp, { recursive: true });
    fs.writeFileSync(path.join(mapp, "index.html"), sida(k, lista, andra, i));
    antal++;
  });
}
console.log(`Skrev ${antal} projektsidor.`);
