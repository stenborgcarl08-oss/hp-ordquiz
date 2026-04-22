/* app.js — Quizlogik för HP Ordquiz
   Hanterar vyväxling, frågeurval, svar och resultatvisning */

// ---------------------------------------------------------------
// Tillstånd (state) — en enda källa för appens nuvarande data
// ---------------------------------------------------------------

/* Samlar all föränderlig data på ett ställe så att det är lätt
   att följa vad som händer i appen */
const state = {
  difficulty: "all",      // vald svårighetsnivå
  currentQuestions: [],   // de 10 frågorna för detta quiz
  currentIndex: 0,        // vilken fråga användaren är på
  answers: []             // användarens svar (ett index per fråga)
};

// ---------------------------------------------------------------
// Elementreferenser — hämtas en gång och återanvänds
// ---------------------------------------------------------------

/* Sparar DOM-noder i variabler för att slippa söka i dokumentet
   upprepade gånger, vilket gör koden snabbare och mer läsbar */
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

const scoreNumber  = document.getElementById("score-number");
const resultLevel  = document.getElementById("result-level");
const resultList   = document.getElementById("result-list");

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

// ---------------------------------------------------------------
// Vyväxling — döljer alla vyer och visar den begärda
// ---------------------------------------------------------------

/* Tar emot ett vy-element och visar bara det.
   "hidden"-attributet är inbyggt i HTML och döljer elementet
   helt för både skärmen och skärmläsare */
function showView(view) {
  viewStart.hidden  = true;
  viewQuiz.hidden   = true;
  viewResult.hidden = true;
  view.hidden = false;
}

// ---------------------------------------------------------------
// Fisher-Yates-blandning — slumpar ordningen i en array
// ---------------------------------------------------------------

/* Algoritmen går baklänges genom arrayen och byter varje element
   mot ett slumpmässigt valt element tidigare i listan.
   Returnerar en ny array och ändrar inte originalet */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------
// Frågeurval — filtrerar, blandar och väljer 10 frågor
// ---------------------------------------------------------------

/* Väljer ut frågorna för ett quiz-omgång:
   1. Filtrerar på svårighetsnivå (eller tar alla om "all")
   2. Blandar med Fisher-Yates
   3. Tar de första 10
   4. Blandar svarsalternativen och uppdaterar correct-index
      så att rätt svar fortfarande stämmer */
function selectQuestions(difficulty) {
  const filtered = difficulty === "all"
    ? questions
    : questions.filter(q => q.difficulty === difficulty);

  const shuffled = shuffle(filtered).slice(0, 10);

  return shuffled.map(q => {
    // Skapa en array av {text, originalIndex} för att kunna
    // spåra vilket alternativ som ursprungligen var rätt
    const indexed = q.options.map((text, i) => ({ text, originalIndex: i }));
    const shuffledOptions = shuffle(indexed);

    const newCorrect = shuffledOptions.findIndex(
      opt => opt.originalIndex === q.correct
    );

    return {
      word: q.word,
      options: shuffledOptions.map(opt => opt.text),
      correct: newCorrect,
      difficulty: q.difficulty
    };
  });
}

// ---------------------------------------------------------------
// Quizflöde — starta, visa fråga, hantera svar
// ---------------------------------------------------------------

/* Startar ett nytt quiz: väljer frågor, nollställer state och
   visar den första frågan */
function startQuiz() {
  state.currentQuestions = selectQuestions(state.difficulty);
  state.currentIndex = 0;
  state.answers = [];

  // Visa nivånamn i quiz-headern
  quizLevel.textContent = levelNames[state.difficulty];

  showView(viewQuiz);
  renderQuestion();
}

/* Ritar upp den aktuella frågan: uppdaterar förloppsindikator,
   visar ordet och skapar fyra svarsknoppar (A/B/C/D) */
function renderQuestion() {
  const q   = state.currentQuestions[state.currentIndex];
  const num = state.currentIndex + 1;
  const tot = state.currentQuestions.length;

  // Förloppstext och bredd på den fyllda stapeln
  progressText.textContent = `Fråga ${num} av ${tot}`;
  progressFill.style.width = `${(num / tot) * 100}%`;

  // Visa ordet som ska besvaras
  questionWord.textContent = q.word;

  // Rensa gamla alternativ och skapa nya knappar
  optionsGrid.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  q.options.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.index = i;
    // Bokstav + text hjälper tangentbordsanvändare att orientera sig
    btn.textContent = `${letters[i]}  ${optionText}`;
    optionsGrid.appendChild(btn);
  });
}

/* Hanterar ett svar: markerar valt alternativ, inaktiverar alla
   knappar och går vidare efter 300 ms så användaren ser valet */
function handleAnswer(selectedIndex) {
  const q = state.currentQuestions[state.currentIndex];

  // Spara svaret
  state.answers.push(selectedIndex);

  // Markera valt alternativ visuellt
  const buttons = optionsGrid.querySelectorAll(".option-btn");
  buttons[selectedIndex].classList.add("selected");

  // Inaktivera alla knappar så att man inte kan svara igen
  buttons.forEach(btn => {
    btn.disabled = true;
    // Visa rätt svar i grönt oavsett vad användaren klickade
    if (Number(btn.dataset.index) === q.correct) {
      btn.classList.add("correct");
    }
  });

  // Vänta kort innan nästa fråga visas — ger visuell feedback
  setTimeout(() => {
    state.currentIndex++;
    if (state.currentIndex < state.currentQuestions.length) {
      renderQuestion();
    } else {
      showResults();
    }
  }, 300);
}

// ---------------------------------------------------------------
// Resultat — räkna poäng och bygg facitlistan
// ---------------------------------------------------------------

/* Räknar rätta svar, visar poängen och bygger upp en lista med
   alla frågor där användaren ser om de svarade rätt eller fel */
function showResults() {
  const qs = state.currentQuestions;

  // Räkna hur många svar som stämmer med correct-index
  const correct = state.answers.filter(
    (ans, i) => ans === qs[i].correct
  ).length;

  scoreNumber.textContent = correct;
  resultLevel.textContent = levelNames[state.difficulty];

  // Bygg facitlistan — ett <li> per fråga
  resultList.innerHTML = "";

  qs.forEach((q, i) => {
    const userAnswer = state.answers[i];
    const isCorrect  = userAnswer === q.correct;

    const li = document.createElement("li");
    li.className = isCorrect ? "result-item correct" : "result-item wrong";

    // Symbol och färg ger snabb visuell överblick
    const symbol = isCorrect ? "✓" : "✗";
    li.innerHTML = `
      <span class="result-icon">${symbol}</span>
      <span class="result-word">${q.word}</span>
      <span class="result-answer">${q.options[q.correct]}</span>
    `;

    resultList.appendChild(li);
  });

  showView(viewResult);
}

// ---------------------------------------------------------------
// Händelselyssnare — kopplar ihop UI med logiken ovan
// ---------------------------------------------------------------

/* Svårighetsknapparna: tar bort .selected från nuvarande knapp,
   lägger till på klickad knapp och uppdaterar state */
document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".difficulty-btn").forEach(b =>
      b.classList.remove("selected")
    );
    btn.classList.add("selected");
    state.difficulty = btn.dataset.difficulty;
  });
});

/* Startknapp — startar ett nytt quiz med vald nivå */
startBtn.addEventListener("click", startQuiz);

/* Delegerad lyssnare på svarsrutorna: fångar klick på valfri
   .option-btn utan att behöva lägga lyssnare på varje knapp
   separat. "closest" hittar rätt element även om man klickar
   på text inuti knappen */
optionsGrid.addEventListener("click", event => {
  const btn = event.target.closest(".option-btn");
  if (!btn || btn.disabled) return;
  handleAnswer(Number(btn.dataset.index));
});

/* Kör igen-knappen — startar om med samma nivå */
retryBtn.addEventListener("click", startQuiz);

/* Hem-knappen — återgår till startvyn utan att ändra nivå */
homeBtn.addEventListener("click", () => showView(viewStart));

// ---------------------------------------------------------------
// Service Worker — möjliggör offlineläge och installation
// ---------------------------------------------------------------

/* Service Worker är ett skript som körs i bakgrunden och kan
   cacha filer så att appen fungerar utan internetanslutning */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
