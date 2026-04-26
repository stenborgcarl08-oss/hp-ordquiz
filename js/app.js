/* app.js — Quizlogik för HP Ordquiz
   Hanterar vyväxling, frågeurval, svar, hintpopup och resultatvisning */

// ---------------------------------------------------------------
// Tillstånd (state) — en enda källa för appens nuvarande data
// ---------------------------------------------------------------

const state = {
  difficulty: "all",      // vald svårighetsnivå
  currentQuestions: [],   // de 10 frågorna för detta quiz
  currentIndex: 0,        // vilken fråga användaren är på
  answers: []             // användarens svar (ett index per fråga)
};

// ---------------------------------------------------------------
// Elementreferenser — hämtas en gång och återanvänds
// ---------------------------------------------------------------

const viewStart   = document.getElementById("view-start");
const viewQuiz    = document.getElementById("view-quiz");
const viewResult  = document.getElementById("view-result");

const startBtn    = document.getElementById("start-btn");
const retryBtn    = document.getElementById("retry-btn");
const homeBtn     = document.getElementById("home-btn");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const quizLevel    = document.getElementById("quiz-level");
const questionWord = document.getElementById("question-word");
const optionsGrid  = document.getElementById("options-grid");

const scoreNumber   = document.getElementById("score-number");
const resultLevel   = document.getElementById("result-level");
const resultMessage = document.getElementById("result-message");
const resultList    = document.getElementById("result-list");

const hintOverlay = document.getElementById("hint-overlay");
const hintWord    = document.getElementById("hint-word");
const hintText    = document.getElementById("hint-text");
const hintClose   = document.getElementById("hint-close");

// ---------------------------------------------------------------
// Nivånamn — översättningstabell från data-värde till visningstext
// ---------------------------------------------------------------

const levelNames = {
  all:   "Blanda allt",
  grund: "Grundnivå",
  medel: "Medelnivå",
  svar:  "Svår nivå",
  elit:  "Elitnivå"
};

// Paus efter svar innan nästa fråga visas.
// 1800 ms ger tid att se både rätt (grönt) och fel (rött) markering
// utan att flödet känns segt.
const ANSWER_FEEDBACK_MS = 1800;

// ---------------------------------------------------------------
// Vyväxling — döljer alla vyer och visar den begärda
// ---------------------------------------------------------------

function showView(view) {
  viewStart.hidden  = true;
  viewQuiz.hidden   = true;
  viewResult.hidden = true;
  view.hidden = false;
}

// ---------------------------------------------------------------
// Fisher-Yates-blandning — slumpar ordningen i en array
// ---------------------------------------------------------------

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------
// Frågeurval — filtrerar, blandar och väljer 10 frågor.
// Varje alternativ är ett objekt { text, hint? } — hint:en följer
// med originalet efter att ordningen har slumpats.
// ---------------------------------------------------------------

function selectQuestions(difficulty) {
  const filtered = difficulty === "all"
    ? questions
    : questions.filter(q => q.difficulty === difficulty);

  const shuffled = shuffle(filtered).slice(0, 10);

  return shuffled.map(q => {
    const indexed = q.options.map((opt, i) => ({ ...opt, originalIndex: i }));
    const shuffledOptions = shuffle(indexed);

    const newCorrect = shuffledOptions.findIndex(
      opt => opt.originalIndex === q.correct
    );

    return {
      word: q.word,
      options: shuffledOptions.map(opt => ({ text: opt.text, hint: opt.hint || null })),
      correct: newCorrect,
      difficulty: q.difficulty
    };
  });
}

// ---------------------------------------------------------------
// Quizflöde — starta, visa fråga, hantera svar
// ---------------------------------------------------------------

function startQuiz() {
  state.currentQuestions = selectQuestions(state.difficulty);
  state.currentIndex = 0;
  state.answers = [];

  quizLevel.textContent = levelNames[state.difficulty];

  showView(viewQuiz);
  renderQuestion();
}

function renderQuestion() {
  const q   = state.currentQuestions[state.currentIndex];
  const num = state.currentIndex + 1;
  const tot = state.currentQuestions.length;

  progressText.textContent = `Fråga ${num} av ${tot}`;
  progressFill.style.width = `${(num / tot) * 100}%`;

  questionWord.textContent = q.word;

  optionsGrid.innerHTML = "";

  q.options.forEach((option, i) => {
    const row = document.createElement("div");
    row.className = "option-row";

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.dataset.index = i;
    btn.textContent = option.text;
    row.appendChild(btn);

    /* Bara alternativ med en förklaring får en pilknapp. Knappen
       ligger som systerelement till svarsknappen (inte inuti) så att
       ett klick på förklaringen inte kan räknas som ett svarsval. */
    if (option.hint) {
      const hintBtn = document.createElement("button");
      hintBtn.className = "option-hint-btn";
      hintBtn.type = "button";
      hintBtn.dataset.hint = option.hint;
      hintBtn.dataset.word = option.text;
      hintBtn.setAttribute("aria-label", `Visa förklaring av ${option.text}`);
      hintBtn.textContent = "▾";
      row.appendChild(hintBtn);
    }

    optionsGrid.appendChild(row);
  });
}

/* Hanterar ett svar: markerar rätt (grönt) och eventuellt fel (rött),
   inaktiverar alla knappar och väntar ANSWER_FEEDBACK_MS innan nästa
   fråga så att användaren hinner se facit. */
function handleAnswer(selectedIndex) {
  const q = state.currentQuestions[state.currentIndex];

  state.answers.push(selectedIndex);

  const buttons = optionsGrid.querySelectorAll(".option-btn");
  const isCorrect = selectedIndex === q.correct;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add("correct");
    } else if (i === selectedIndex && !isCorrect) {
      btn.classList.add("wrong");
    }
  });

  // Stäng också av pilknapparna under feedbackfasen så att popupen
  // inte kan öppnas mitt i övergången till nästa fråga
  optionsGrid.querySelectorAll(".option-hint-btn").forEach(b => {
    b.disabled = true;
  });

  setTimeout(() => {
    state.currentIndex++;
    if (state.currentIndex < state.currentQuestions.length) {
      renderQuestion();
    } else {
      showResults();
    }
  }, ANSWER_FEEDBACK_MS);
}

// ---------------------------------------------------------------
// Förklaringspopup — öppnas via pilknappen bredvid ett alternativ
// ---------------------------------------------------------------

function showHint(word, text) {
  hintWord.textContent = word;
  hintText.textContent = text;
  hintOverlay.hidden = false;
}

function hideHint() {
  hintOverlay.hidden = true;
}

// ---------------------------------------------------------------
// Resultat — räkna poäng, välj meddelande och bygg facitlistan
// ---------------------------------------------------------------

/* Plockar ett uppmuntrande meddelande baserat på andelen rätt.
   Flera alternativ per nivå gör att samma text inte dyker upp varje gång. */
function pickResultMessage(correct, total) {
  const ratio = correct / total;
  let pool;

  if (ratio === 1) {
    pool = [
      "Perfekt! Alla rätt — imponerande!",
      "Fullpott! Du är vass på ord.",
      "Inga fel — stark prestation!"
    ];
  } else if (ratio >= 0.8) {
    pool = [
      "Starkt jobbat — du är nästan där!",
      "Riktigt bra! Bara några kvar att slipa.",
      "Mycket bra koll på orden!"
    ];
  } else if (ratio >= 0.5) {
    pool = [
      "Bra insats — kör en till och pusha vidare!",
      "Du är på god väg. En runda till?",
      "Schysst! Lite träning kvar bara."
    ];
  } else if (ratio > 0) {
    pool = [
      "Bra att du tränar — varje runda hjälper!",
      "Ingen stress, orden fastnar med tiden.",
      "Håll i, varje försök är ett steg framåt."
    ];
  } else {
    pool = [
      "Ingen panik — det här är hur man lär sig!",
      "Börja om och ta det lugnt, du fixar det.",
      "Alla börjar någonstans. Kör en runda till!"
    ];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function showResults() {
  const qs = state.currentQuestions;

  const correct = state.answers.filter(
    (ans, i) => ans === qs[i].correct
  ).length;

  scoreNumber.textContent = correct;
  resultLevel.textContent = levelNames[state.difficulty];
  resultMessage.textContent = pickResultMessage(correct, qs.length);

  resultList.innerHTML = "";

  qs.forEach((q, i) => {
    const userAnswer = state.answers[i];
    const isCorrect  = userAnswer === q.correct;
    const correctOpt = q.options[q.correct];

    const li = document.createElement("li");
    li.className = isCorrect ? "result-item correct" : "result-item wrong";

    const symbol = isCorrect ? "✓" : "✗";

    /* Hint:en visas efter det rätta ordet så att facit direkt ger
       förklaringen utan att användaren behöver leta efter den. */
    const hintHtml = correctOpt.hint
      ? `<span class="result-hint"> — ${escapeHtml(correctOpt.hint)}</span>`
      : "";

    li.innerHTML = `
      <div class="result-row">
        <span class="result-icon">${symbol}</span>
        <span class="result-word">${escapeHtml(q.word)}</span>
      </div>
      <div class="result-answer"><strong>Rätt svar:</strong> ${escapeHtml(correctOpt.text)}${hintHtml}</div>
    `;

    resultList.appendChild(li);
  });

  showView(viewResult);
}

/* Enkel HTML-escape så att användargenererad text (kommer från questions.js)
   inte kan bryta ut ur innerHTML. questions.js är vår egen data, men det är
   en god vana att alltid sanera när innerHTML används. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------
// Händelselyssnare — kopplar ihop UI med logiken ovan
// ---------------------------------------------------------------

document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".difficulty-btn").forEach(b =>
      b.classList.remove("selected")
    );
    btn.classList.add("selected");
    state.difficulty = btn.dataset.difficulty;
  });
});

startBtn.addEventListener("click", startQuiz);

/* Ett klick i svarsraden kan gälla antingen pilknappen (öppna hint)
   eller själva svarsknappen (välj svar). Pilknappen kollas först så
   att den aldrig av misstag registreras som ett svarsval. */
optionsGrid.addEventListener("click", event => {
  const hintBtn = event.target.closest(".option-hint-btn");
  if (hintBtn) {
    if (hintBtn.disabled) return;
    showHint(hintBtn.dataset.word, hintBtn.dataset.hint);
    return;
  }
  const btn = event.target.closest(".option-btn");
  if (!btn || btn.disabled) return;
  handleAnswer(Number(btn.dataset.index));
});

/* Klick utanför hint-rutan (på overlay-bakgrunden eller på Stäng)
   döljer förklaringen. Klick på själva rutan släpps igenom. */
hintOverlay.addEventListener("click", event => {
  if (event.target === hintOverlay || event.target === hintClose) {
    hideHint();
  }
});

retryBtn.addEventListener("click", startQuiz);
homeBtn.addEventListener("click", () => showView(viewStart));

// ---------------------------------------------------------------
// Service Worker — möjliggör offlineläge och installation
// ---------------------------------------------------------------

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
