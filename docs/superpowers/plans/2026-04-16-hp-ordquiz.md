# HP Ordquiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a quiz web app for practicing the vocabulary section of the Swedish högskoleprov, with PWA support for iPhone.

**Architecture:** Single-page app with three views (start, quiz, results) toggled via JavaScript. All question data stored as a JS array. Service worker enables offline use. No build tools, no frameworks.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, PWA (manifest.json + Service Worker)

**Design reference:** `DESIGN.md` (Composio-inspired dark theme). Key values: background `#0f0f0f`, accent `#00ffff`, borders `rgba(255,255,255, 0.04–0.12)`, brutalist shadow `4px 4px`, fonts: Inter (primary, free alternative to abcDiatype) + JetBrains Mono (monospace).

**Spec:** `docs/superpowers/specs/2026-04-16-hp-ordquiz-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Semantic HTML structure for all three views, PWA meta tags, script/style links |
| `css/style.css` | All styling: Composio theme, layout, components, responsive breakpoints |
| `js/questions.js` | Question data array (100 questions with word, options, correct index, difficulty) |
| `js/app.js` | App logic: view switching, quiz flow, shuffle, scoring, results rendering |
| `manifest.json` | PWA manifest for install on iPhone |
| `sw.js` | Service worker: cache all assets, serve offline |
| `icons/icon-192.png` | App icon 192x192 |
| `icons/icon-512.png` | App icon 512x512 |

---

### Task 1: Project Setup & Base HTML

**Files:**
- Create: `index.html`

- [ ] **Step 1: Initialize git repo**

```bash
cd "C:/Users/Calle/Documents/Projekt/HP webbapp"
git init
echo ".superpowers/" > .gitignore
git add .gitignore CLAUDE.md DESIGN.md docs/
git commit -m "init: project setup with design spec and plan"
```

- [ ] **Step 2: Create index.html with all three view containers**

Create `index.html` with:
- DOCTYPE, lang="sv", charset UTF-8, viewport meta
- PWA meta tags (apple-mobile-web-app-capable, theme-color, manifest link, apple-touch-icon)
- Link to `css/style.css`
- `<main>` containing three `<section>` elements with ids: `view-start`, `view-quiz`, `view-result`
- `view-quiz` and `view-result` get `hidden` attribute by default
- Script tags for `js/questions.js` then `js/app.js` (defer)

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HP Ordquiz</title>
  <meta name="description" content="Träna på orddelen i högskoleprovet">
  <meta name="theme-color" content="#0f0f0f">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main>
    <!-- Startsida: nivåval och starta-knapp -->
    <section id="view-start">
      <h1>HP Ordquiz</h1>
      <p class="subtitle">Träna på orddelen i högskoleprovet</p>

      <div class="difficulty-buttons" role="radiogroup" aria-label="Välj svårighetsnivå">
        <button class="difficulty-btn selected" data-difficulty="all">Blanda allt</button>
        <button class="difficulty-btn" data-difficulty="grund">Grund</button>
        <button class="difficulty-btn" data-difficulty="medel">Medel</button>
        <button class="difficulty-btn" data-difficulty="svar">Svår</button>
        <button class="difficulty-btn" data-difficulty="elit">Elit</button>
      </div>

      <button class="btn-primary" id="start-btn">Starta quiz</button>
    </section>

    <!-- Quiz: en fråga i taget -->
    <section id="view-quiz" hidden>
      <div class="quiz-header">
        <span class="quiz-progress-text" id="progress-text">Fråga 1 av 10</span>
        <span class="quiz-level" id="quiz-level">Grundnivå</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill"></div>
      </div>

      <div class="question-card">
        <h2 class="question-word" id="question-word">Aberration</h2>
        <p class="question-prompt">Vad betyder detta ord?</p>

        <div class="options-grid" id="options-grid">
          <!-- Fylls av JavaScript -->
        </div>
      </div>
    </section>

    <!-- Resultat: poäng och facit -->
    <section id="view-result" hidden>
      <div class="result-score">
        <span class="score-number" id="score-number">0</span>
        <span class="score-total">/10</span>
      </div>
      <p class="result-level" id="result-level">Grundnivå</p>

      <ul class="result-list" id="result-list">
        <!-- Fylls av JavaScript -->
      </ul>

      <div class="result-buttons">
        <button class="btn-primary" id="retry-btn">Kör igen</button>
        <button class="btn-secondary" id="home-btn">Tillbaka till start</button>
      </div>
    </section>
  </main>

  <script src="js/questions.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify HTML in browser**

Open `index.html` in browser. Should see unstyled text: heading, buttons, question placeholder. Quiz and result sections should be hidden.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add base HTML structure with all three views"
```

---

### Task 2: Question Data

**Files:**
- Create: `js/questions.js`

- [ ] **Step 1: Create js directory and questions.js**

Create `js/questions.js` containing the full `questions` array. All 100 questions from the user's provided material, structured as:

```javascript
/* Frågedata för HP Ordquiz
   Varje fråga har: word, options (4 st), correct (index 0-3), difficulty */
const questions = [
  // === GRUNDNIVÅ (Test 1–5, 50 frågor) ===
  { word: "Aberration", options: ["Avvikelse", "Upprepning", "Förkortning", "Översättning"], correct: 0, difficulty: "grund" },
  { word: "Pragmatisk", options: ["Teoretisk", "Praktisk", "Pessimistisk", "Diplomatisk"], correct: 1, difficulty: "grund" },
  { word: "Paradox", options: ["Parallell", "Liknelse", "Motsägelse", "Överdrift"], correct: 2, difficulty: "grund" },
  { word: "Allegorisk", options: ["Bokstavlig", "Symbolisk", "Historisk", "Ironisk"], correct: 1, difficulty: "grund" },
  { word: "Dogmatisk", options: ["Flexibel", "Tveksam", "Trosvist", "Vetenskaplig"], correct: 2, difficulty: "grund" },
  // ... (alla 50 grundnivå-frågor)

  // === MEDELNIVÅ (Test 6–7, 20 frågor) ===
  // ... (alla 20 medelnivå-frågor)

  // === SVÅR NIVÅ (Test 8–9, 20 frågor) ===
  // ... (alla 20 svår-frågor)

  // === ELITNIVÅ (Test 10, 10 frågor) ===
  // ... (alla 10 elitnivå-frågor)
];
```

Populate with all 100 questions from the user's material (10 mini-test × 10 frågor). The five example questions above show the format. The full file must contain all 100 entries.

**Important:** The user has previously provided this data. If the exact questions are not available in conversation context, ask the user to provide them before proceeding. Do NOT invent questions.

- [ ] **Step 2: Verify data loads**

Add a temporary `console.log(questions.length)` at the end of `questions.js`. Open `index.html` in browser, check console shows `100`.

Remove the `console.log` line after verifying.

- [ ] **Step 3: Commit**

```bash
git add js/questions.js
git commit -m "feat: add question data (100 questions in 4 difficulty levels)"
```

---

### Task 3: CSS Styling

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Create css directory and style.css with reset and base theme**

```css
/* === RESET OCH BAS === */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  background-color: #0f0f0f;
  color: #ffffff;
  min-height: 100vh;
  min-height: 100dvh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* === LAYOUT === */
main {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Dölj inaktiva vyer */
[hidden] {
  display: none !important;
}
```

- [ ] **Step 2: Add start view styles**

```css
/* === STARTSIDA === */
#view-start {
  text-align: center;
}

#view-start h1 {
  font-size: 3rem;
  font-weight: 400;
  line-height: 0.87;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 40px;
}

/* Nivåknappar */
.difficulty-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
}

.difficulty-btn {
  font-family: inherit;
  font-size: 0.875rem;
  padding: 8px 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background-color 0.2s;
}

.difficulty-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.difficulty-btn.selected {
  border-color: rgba(0, 255, 255, 0.4);
  color: #00ffff;
  background: rgba(0, 255, 255, 0.06);
}

/* Knappar */
.btn-primary {
  font-family: inherit;
  font-size: 1rem;
  padding: 12px 32px;
  background: #ffffff;
  color: #0f0f0f;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  font-family: inherit;
  font-size: 1rem;
  padding: 12px 32px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.2);
}
```

- [ ] **Step 3: Add quiz view styles**

```css
/* === QUIZ === */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.quiz-progress-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}

.quiz-level {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Progressbar */
.progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  margin-bottom: 32px;
}

.progress-fill {
  height: 100%;
  background: #00ffff;
  border-radius: 2px;
  width: 0%;
  transition: width 0.3s ease;
}

/* Frågekort med brutalistisk skugga */
.question-card {
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.15) 4px 4px 0px 0px;
}

.question-word {
  font-size: 2rem;
  font-weight: 400;
  line-height: 0.9;
  margin-bottom: 8px;
}

.question-prompt {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 24px;
}

/* 2x2-grid för svarsalternativ */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.option-btn {
  font-family: inherit;
  font-size: 0.875rem;
  padding: 14px 12px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
}

.option-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* Markerat svar */
.option-btn.selected {
  border-color: rgba(0, 255, 255, 0.4);
  background: rgba(0, 255, 255, 0.06);
  color: #ffffff;
}

/* Bokstavslabel i knappen */
.option-letter {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  display: block;
  margin-bottom: 2px;
}

.option-btn.selected .option-letter {
  color: #00ffff;
}
```

- [ ] **Step 4: Add result view styles**

```css
/* === RESULTAT === */
#view-result {
  text-align: center;
}

.result-score {
  margin-bottom: 4px;
}

.score-number {
  font-size: 3.5rem;
  font-weight: 400;
  color: #00ffff;
  line-height: 1;
}

.score-total {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
}

.result-level {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
}

/* Facit-lista */
.result-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
  text-align: left;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.result-item.correct {
  border: 1px solid rgba(0, 255, 100, 0.2);
  background: rgba(0, 255, 100, 0.04);
}

.result-item.wrong {
  border: 1px solid rgba(255, 60, 60, 0.2);
  background: rgba(255, 60, 60, 0.04);
}

.result-icon {
  font-size: 0.875rem;
  flex-shrink: 0;
}

.result-item.correct .result-icon {
  color: rgba(0, 255, 100, 0.7);
}

.result-item.wrong .result-icon {
  color: rgba(255, 60, 60, 0.7);
}

.result-word {
  color: rgba(255, 255, 255, 0.7);
}

.result-answer {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8125rem;
}

/* Knappar under resultat */
.result-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
```

- [ ] **Step 5: Add responsive styles**

```css
/* === RESPONSIVT === */
@media (max-width: 600px) {
  #view-start h1 {
    font-size: 2rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .question-card {
    padding: 24px 16px;
  }

  .question-word {
    font-size: 1.5rem;
  }

  .result-buttons {
    flex-direction: column;
  }

  .result-buttons .btn-primary,
  .result-buttons .btn-secondary {
    width: 100%;
  }
}

/* === PWA: SAFE AREA FÖR IPHONE NOTCH === */
@supports (padding-top: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
```

- [ ] **Step 6: Verify in browser**

Open `index.html` in browser. Should see the dark themed start screen with styled heading, difficulty buttons, and start button. Use browser dev tools to check mobile view (600px wide) — options grid should not be visible yet (quiz view is hidden), but start page should look correct.

- [ ] **Step 7: Commit**

```bash
git add css/style.css
git commit -m "feat: add Composio-inspired CSS styling for all views"
```

---

### Task 4: App Logic — View Switching & Quiz Flow

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: Create app.js with state and utility functions**

```javascript
/* Applogik för HP Ordquiz
   Hanterar vybyten, quiz-flöde, slumpning och resultat */

// === TILLSTÅND ===
const state = {
  difficulty: "all",
  currentQuestions: [],
  currentIndex: 0,
  answers: []
};

// === ELEMENT-REFERENSER ===
const els = {
  viewStart: document.getElementById("view-start"),
  viewQuiz: document.getElementById("view-quiz"),
  viewResult: document.getElementById("view-result"),
  startBtn: document.getElementById("start-btn"),
  retryBtn: document.getElementById("retry-btn"),
  homeBtn: document.getElementById("home-btn"),
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  quizLevel: document.getElementById("quiz-level"),
  questionWord: document.getElementById("question-word"),
  optionsGrid: document.getElementById("options-grid"),
  scoreNumber: document.getElementById("score-number"),
  resultLevel: document.getElementById("result-level"),
  resultList: document.getElementById("result-list")
};

// === VYHANTERING ===
function showView(view) {
  els.viewStart.hidden = true;
  els.viewQuiz.hidden = true;
  els.viewResult.hidden = true;
  view.hidden = false;
}
```

- [ ] **Step 2: Add shuffle and question selection**

```javascript
// === SLUMPNING (Fisher-Yates) ===
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Välj 10 slumpade frågor, slumpa även svarsalternativens ordning
function selectQuestions(difficulty) {
  const filtered = difficulty === "all"
    ? questions
    : questions.filter(q => q.difficulty === difficulty);

  const shuffled = shuffle(filtered);
  const selected = shuffled.slice(0, 10);

  return selected.map(q => {
    const indices = shuffle([0, 1, 2, 3]);
    return {
      word: q.word,
      options: indices.map(i => q.options[i]),
      correct: indices.indexOf(q.correct),
      difficulty: q.difficulty
    };
  });
}
```

- [ ] **Step 3: Add quiz flow (render question, handle answer)**

```javascript
// === NIVÅNAMN ===
const levelNames = {
  all: "Blanda allt",
  grund: "Grundnivå",
  medel: "Medelnivå",
  svar: "Svår nivå",
  elit: "Elitnivå"
};

// === QUIZ-FLÖDE ===
function startQuiz() {
  state.currentQuestions = selectQuestions(state.difficulty);
  state.currentIndex = 0;
  state.answers = [];
  els.quizLevel.textContent = levelNames[state.difficulty];
  showView(els.viewQuiz);
  renderQuestion();
}

function renderQuestion() {
  const q = state.currentQuestions[state.currentIndex];
  const num = state.currentIndex + 1;
  const total = state.currentQuestions.length;

  els.progressText.textContent = `Fråga ${num} av ${total}`;
  els.progressFill.style.width = `${(num / total) * 100}%`;
  els.questionWord.textContent = q.word;

  const letters = ["A", "B", "C", "D"];
  els.optionsGrid.innerHTML = q.options.map((opt, i) => `
    <button class="option-btn" data-index="${i}">
      <span class="option-letter">${letters[i]}</span>
      ${opt}
    </button>
  `).join("");
}

function handleAnswer(selectedIndex) {
  const q = state.currentQuestions[state.currentIndex];

  state.answers.push({
    word: q.word,
    selected: selectedIndex,
    correct: q.correct,
    correctText: q.options[q.correct]
  });

  // Visuell feedback — markera valt alternativ
  const buttons = els.optionsGrid.querySelectorAll(".option-btn");
  buttons.forEach(btn => { btn.disabled = true; });
  buttons[selectedIndex].classList.add("selected");

  // Kort paus, sedan nästa fråga eller resultat
  setTimeout(() => {
    state.currentIndex++;
    if (state.currentIndex < state.currentQuestions.length) {
      renderQuestion();
    } else {
      showResults();
    }
  }, 300);
}
```

- [ ] **Step 4: Add results rendering**

```javascript
// === RESULTAT ===
function showResults() {
  const score = state.answers.filter(a => a.selected === a.correct).length;
  els.scoreNumber.textContent = score;
  els.resultLevel.textContent = levelNames[state.difficulty];

  els.resultList.innerHTML = state.answers.map(a => {
    const isCorrect = a.selected === a.correct;
    return `
      <li class="result-item ${isCorrect ? "correct" : "wrong"}">
        <span class="result-icon">${isCorrect ? "✓" : "✗"}</span>
        <span class="result-word">${a.word}</span>
        <span class="result-answer">${a.correctText}</span>
      </li>
    `;
  }).join("");

  showView(els.viewResult);
}
```

- [ ] **Step 5: Add event listeners and initialization**

```javascript
// === EVENT LISTENERS ===

// Nivåval
document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".difficulty-btn.selected").classList.remove("selected");
    btn.classList.add("selected");
    state.difficulty = btn.dataset.difficulty;
  });
});

// Starta quiz
els.startBtn.addEventListener("click", startQuiz);

// Svarsalternativ (delegerad lyssnare)
els.optionsGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".option-btn");
  if (!btn || btn.disabled) return;
  handleAnswer(Number(btn.dataset.index));
});

// Kör igen (samma nivå)
els.retryBtn.addEventListener("click", startQuiz);

// Tillbaka till start
els.homeBtn.addEventListener("click", () => {
  showView(els.viewStart);
});

// Registrera service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
```

- [ ] **Step 6: Verify full quiz flow in browser**

Open `index.html` in browser:
1. Select a difficulty → button highlights cyan
2. Click "Starta quiz" → quiz view appears with progress bar, word, 4 options
3. Click an option → brief highlight, next question loads
4. After 10 questions → result screen shows score and answer list
5. "Kör igen" → restarts quiz with same level
6. "Tillbaka till start" → returns to start view

Test on mobile viewport (375px) in dev tools — options should stack to one column.

- [ ] **Step 7: Commit**

```bash
git add js/app.js
git commit -m "feat: add quiz flow with shuffle, scoring, and results"
```

---

### Task 5: PWA Setup

**Files:**
- Create: `manifest.json`
- Create: `sw.js`
- Create: `icons/icon-192.png`
- Create: `icons/icon-512.png`

- [ ] **Step 1: Create manifest.json**

```json
{
  "name": "HP Ordquiz",
  "short_name": "HP Quiz",
  "description": "Träna på orddelen i högskoleprovet",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f0f",
  "theme_color": "#0f0f0f",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 2: Create sw.js**

```javascript
/* Service Worker — cachar alla filer för offline-användning */
const CACHE_NAME = "hp-ordquiz-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/questions.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Installera: cacha alla filer
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Aktivera: rensa gamla cacher
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// Hämta: cache-first, fallback till nätverk
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

- [ ] **Step 3: Create app icons**

Generate two simple PNG icons with the letter "HP" on a dark background with cyan accent. Use an inline SVG converted to PNG, or create minimal placeholder PNGs.

The simplest approach: create SVG files and convert, or use a canvas script. Since we have no build tools, create the icons as simple SVG-based data. An alternative: create the icons using an online tool and save to `icons/`.

For a minimal working version, create placeholder icons:

```bash
mkdir -p icons
```

Then create simple icons using ImageMagick if available, or note for the user to provide icons. At minimum, create placeholder files so the PWA manifest doesn't 404.

- [ ] **Step 4: Verify PWA**

Serve the app with a local server (required for service worker):

```bash
npx serve .
```

Open the served URL. In Chrome DevTools → Application tab:
- Manifest section should show "HP Ordquiz" with correct theme color
- Service Worker should show as registered
- On iPhone: open in Safari, tap Share → "Lägg till på hemskärmen" — app should appear with icon

- [ ] **Step 5: Commit**

```bash
git add manifest.json sw.js icons/
git commit -m "feat: add PWA support with manifest and service worker"
```

---

### Task 6: Final Polish & Verification

- [ ] **Step 1: Cross-browser test**

Test in:
- Desktop Chrome (full width)
- Desktop Chrome (375px mobile viewport via dev tools)
- Safari on iPhone (if available)

Check:
- All three views work correctly
- Difficulty selection highlights properly
- Quiz flows through 10 questions
- Results show correct/wrong with colors
- "Kör igen" and "Tillbaka till start" both work
- No console errors

- [ ] **Step 2: Validate HTML**

Open https://validator.w3.org/ and paste the HTML. Fix any warnings or errors.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "polish: final verification and fixes"
```
