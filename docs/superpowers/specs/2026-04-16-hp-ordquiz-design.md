# HP Ordquiz — Designspec

## Översikt

En webbapp för att träna på orddelen i svenska högskoleprovet. Användaren väljer svårighetsnivå, svarar på 10 slumpade flervalsfrågor och ser sitt resultat med facit.

**Stack:** HTML5, CSS3, vanilla JavaScript
**Visuell stil:** Composio-inspirerad (se DESIGN.md) — mörk bakgrund, cyan-accenter, brutalistiska skuggor

## Vyer

Appen har tre vyer som visas/döljs med JavaScript (single-page, ingen routing).

### 1. Startsida

- Centrerad layout
- Rubrik: appnamn + kort beskrivning
- Fem nivåknappar i en rad: **Grund**, **Medel**, **Svår**, **Elit**, **Blanda allt**
  - Vald nivå markeras med cyan border/glow
  - "Blanda allt" slumpar från samtliga nivåer
- "Starta quiz"-knapp (vit primary CTA)
- Inget annat — ingen navigation, ingen statistik, ingen ordlista

### 2. Quiz-fråga

- Progress-bar överst (cyan, visar fråga X av 10)
- Frågenummer och nivå visas bredvid progress-baren
- Ordet visas stort och centrerat i ett upphöjt kort med brutalistisk skugga (`4px 4px`)
- Under ordet: "Vad betyder detta ord?"
- Fyra svarsalternativ (A/B/C/D) i ett 2x2-grid inuti kortet
  - På mobil (under 600px): faller till en kolumn
  - Markerat alternativ får cyan border och subtil cyan bakgrund
- När användaren klickar ett alternativ sparas svaret och nästa fråga visas automatiskt (kort fördröjning ~300ms för visuell feedback)

### 3. Resultat

- Poäng visas stort överst i cyan (t.ex. "8/10")
- Nivå och test-info under poängen
- Lista med alla 10 frågor:
  - Grön border + ✓ för rätt svar
  - Röd border + ✗ för fel svar, rätt svar visas till höger
  - Varje rad: ordet + vad rätt svar var
- Två knappar under listan:
  - "Kör igen" — ny omgång med samma nivå
  - "Tillbaka till start" — åter till nivåval

## Datamodell

Alla frågor lagras som en JavaScript-array direkt i en separat fil (`js/questions.js`).

```javascript
const questions = [
  {
    word: "Aberration",
    options: ["Avvikelse", "Upprepning", "Förkortning", "Översättning"],
    correct: 0,
    difficulty: "grund"
  },
  // ...
];
```

**Svårighetsnivåer:**
- `"grund"` — Test 1–5 (vanliga HP-ord)
- `"medel"` — Test 6–7
- `"svar"` (svår) — Test 8–9
- `"elit"` — Test 10 (nyanser, elitnivå)

Exakt fördelning av de 100 orden i nivåer justeras efter befintligt material.

## Slumpningslogik

1. Filtrera frågor efter vald nivå (eller alla om "Blanda allt")
2. Slumpa ordningen med Fisher-Yates shuffle
3. Välj de första 10
4. Slumpa ordningen på svarsalternativen inom varje fråga (flytta `correct`-index)

## Filstruktur

```
HP webbapp/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js          (applogik: vyhantering, quiz-flöde, resultat)
│   └── questions.js    (frågedata)
├── manifest.json        (PWA-manifest)
├── sw.js                (Service Worker för offline)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── DESIGN.md
├── CLAUDE.md
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-16-hp-ordquiz-design.md
```

## PWA (Progressive Web App)

Appen ska fungera som en vanlig webbsida på desktop och kunna installeras som en PWA på iPhone (Lägg till på hemskärmen).

### manifest.json
- `name`: "HP Ordquiz"
- `short_name`: "HP Quiz"
- `start_url`: "/"
- `display`: "standalone"
- `background_color`: "#0f0f0f"
- `theme_color`: "#0f0f0f"
- Ikoner i 192x192 och 512x512 (genereras som enkla SVG→PNG med appens initial)

### Service Worker (sw.js)
- Cachar alla filer vid installation (HTML, CSS, JS, ikoner)
- Appen fungerar helt offline efter första besöket
- Enkel cache-first-strategi (allt innehåll är statiskt)

### index.html meta-taggar
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="theme-color" content="#0f0f0f">`
- `<link rel="apple-touch-icon" href="icons/icon-192.png">`
- `<link rel="manifest" href="manifest.json">`

## Responsivitet

- **Desktop (>768px):** Centrerad container max 600px bred, 2x2-grid för svarsalternativ
- **Mobil (<600px):** Svarsalternativ i en kolumn, mindre typstorlekar, full bredd med padding
- Touch targets minst 44x44px på alla knappar

## Tillgänglighet

- Semantisk HTML: `<main>`, `<section>`, `<button>`
- Knappar är riktiga `<button>`-element (inte `<div>`)
- Fokussynlighet på alla interaktiva element
- Tillräcklig kontrast (vit text på mörk bakgrund uppfyller WCAG AA)

## Avgränsningar

Dessa funktioner ingår INTE i första versionen:
- Ordlista / browse-vy
- Sparad statistik mellan sessioner
- Fritextsvar
- Timer / tidsbegränsning
- Ljust tema
