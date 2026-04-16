/* Frågedata för HP Ordquiz
   Varje fråga har: word, options (4 st), correct (index 0-3), difficulty
   Nivåer: grund (introtest + test 1-5), medel (test 6-7),
           svar (test 8-9), elit (test 10) */
const questions = [

  // === INTROTEST (10 frågor, grundnivå) ===
  { word: "Aberration", options: ["Förbättring", "Avvikelse", "Förklaring", "Upprepning"], correct: 1, difficulty: "grund" },
  { word: "Ambivalent", options: ["Säker", "Likgiltig", "Klart negativ", "Kluven"], correct: 3, difficulty: "grund" },
  { word: "Arbiträr", options: ["Slumpmässig", "Rättvis", "Noggrann", "Naturlig"], correct: 0, difficulty: "grund" },
  { word: "Koncis", options: ["Otydlig", "Kortfattad", "Komplicerad", "Uttömmande"], correct: 1, difficulty: "grund" },
  { word: "Obskyr", options: ["Känd", "Enkel", "Oklar", "Snabb"], correct: 2, difficulty: "grund" },
  { word: "Preliminär", options: ["Slutgiltig", "Tillfällig", "Felaktig", "Försenad"], correct: 1, difficulty: "grund" },
  { word: "Subtil", options: ["Tydlig", "Svag", "Finstämd", "Enkel"], correct: 2, difficulty: "grund" },
  { word: "Vederlägga", options: ["Bevisa", "Förklara", "Motbevisa", "Förstärka"], correct: 2, difficulty: "grund" },
  { word: "Resignerad", options: ["Arg", "Uppgiven", "Förvirrad", "Stolt"], correct: 1, difficulty: "grund" },
  { word: "Tvetydig", options: ["Klar", "Enkelt", "Osäker", "Dubbeltydig"], correct: 3, difficulty: "grund" },

  // === MINI-TEST 1 (grundnivå) ===
  { word: "Fatal", options: ["Ofarlig", "Ödesdiger", "Snabb", "Tillfällig"], correct: 1, difficulty: "grund" },
  { word: "Frugal", options: ["Slösaktig", "Sparsam", "Rik", "Generös"], correct: 1, difficulty: "grund" },
  { word: "Explicit", options: ["Otydlig", "Uttalad", "Hemlig", "Svår"], correct: 1, difficulty: "grund" },
  { word: "Indikativ", options: ["Otydlig", "Avgörande", "Visande", "Slumpmässig"], correct: 2, difficulty: "grund" },
  { word: "Legitima", options: ["Lagliga", "Falska", "Dolda", "Tillfälliga"], correct: 0, difficulty: "grund" },
  { word: "Restriktiv", options: ["Fri", "Begränsande", "Mild", "Snabb"], correct: 1, difficulty: "grund" },
  { word: "Hypotetisk", options: ["Verklig", "Tänkt", "Slumpmässig", "Färdig"], correct: 1, difficulty: "grund" },
  { word: "Notorisk", options: ["Okänd", "Känd (negativt)", "Ny", "Tillfällig"], correct: 1, difficulty: "grund" },
  { word: "Paradoxal", options: ["Logisk", "Motsägelsefull", "Enkel", "Självklar"], correct: 1, difficulty: "grund" },
  { word: "Destruktiv", options: ["Uppbyggande", "Skadlig", "Snabb", "Mild"], correct: 1, difficulty: "grund" },

  // === MINI-TEST 2 (grundnivå) ===
  { word: "Klandervärd", options: ["Bra", "Berömvärd", "Kritiserbar", "Neutral"], correct: 2, difficulty: "grund" },
  { word: "Försumlig", options: ["Noggrann", "Slarvig", "Snabb", "Aktiv"], correct: 1, difficulty: "grund" },
  { word: "Underminera", options: ["Förstärka", "Försvaga", "Bygga", "Skydda"], correct: 1, difficulty: "grund" },
  { word: "Hävdvunnen", options: ["Ny", "Tillfällig", "Traditionell", "Slumpmässig"], correct: 2, difficulty: "grund" },
  { word: "Oförvitlig", options: ["Skyldig", "Felfri", "Otydlig", "Ovanlig"], correct: 1, difficulty: "grund" },
  { word: "Tillstymmelse", options: ["Slut", "Början", "Problem", "Resultat"], correct: 1, difficulty: "grund" },
  { word: "Uppfordrande", options: ["Snäll", "Krävande", "Otydlig", "Passiv"], correct: 1, difficulty: "grund" },
  { word: "Förespegla", options: ["Avslöja", "Visa tydligt", "Ge falsk bild", "Förklara"], correct: 2, difficulty: "grund" },
  { word: "Konsekvent", options: ["Ologisk", "Följdriktig", "Slumpmässig", "Snabb"], correct: 1, difficulty: "grund" },
  { word: "Temporär", options: ["Permanent", "Tillfällig", "Snabb", "Svår"], correct: 1, difficulty: "grund" },

  // === MINI-TEST 3 (grundnivå) ===
  { word: "Divergerande", options: ["Sammanfallande", "Åtskiljande", "Liknande", "Snabb"], correct: 1, difficulty: "grund" },
  { word: "Fundamental", options: ["Ytlig", "Grundläggande", "Tillfällig", "Svår"], correct: 1, difficulty: "grund" },
  { word: "Marginell", options: ["Central", "Obetydlig", "Tydlig", "Stor"], correct: 1, difficulty: "grund" },
  { word: "Kompromiss", options: ["Konflikt", "Överenskommelse", "Problem", "Lösning"], correct: 1, difficulty: "grund" },
  { word: "Analog", options: ["Liknande", "Olika", "Slumpmässig", "Snabb"], correct: 0, difficulty: "grund" },
  { word: "Distanserad", options: ["Närvarande", "Avståndstagande", "Snabb", "Varm"], correct: 1, difficulty: "grund" },
  { word: "Progressiv", options: ["Bakåtsträvande", "Framåtgående", "Stillastående", "Slumpmässig"], correct: 1, difficulty: "grund" },
  { word: "Evident", options: ["Oklart", "Tydligt", "Hemligt", "Svårt"], correct: 1, difficulty: "grund" },
  { word: "Relativ", options: ["Absolut", "Föränderlig", "Snabb", "Enkel"], correct: 1, difficulty: "grund" },

  // === MINI-TEST 4 (grundnivå) ===
  { word: "Generös", options: ["Snål", "Frikostig", "Otydlig", "Svår"], correct: 1, difficulty: "grund" },
  { word: "Kritisk", options: ["Okritisk", "Granskande", "Snabb", "Neutral"], correct: 1, difficulty: "grund" },
  { word: "Abstrakt", options: ["Konkret", "Teoretisk", "Enkel", "Snabb"], correct: 1, difficulty: "grund" },
  { word: "Konventionell", options: ["Ovanlig", "Traditionell", "Slumpmässig", "Ny"], correct: 1, difficulty: "grund" },
  { word: "Ambitiös", options: ["Lat", "Målmedveten", "Snabb", "Otydlig"], correct: 1, difficulty: "grund" },
  { word: "Exkludera", options: ["Inkludera", "Utesluta", "Förklara", "Förstärka"], correct: 1, difficulty: "grund" },
  { word: "Eliminera", options: ["Skapa", "Ta bort", "Förklara", "Öka"], correct: 1, difficulty: "grund" },
  { word: "Dominera", options: ["Underordna", "Styra", "Försvaga", "Minska"], correct: 1, difficulty: "grund" },
  { word: "Konsekvens", options: ["Orsak", "Följd", "Problem", "Slump"], correct: 1, difficulty: "grund" },
  { word: "Neutral", options: ["Partisk", "Opartisk", "Aktiv", "Snabb"], correct: 1, difficulty: "grund" },

  // === MINI-TEST 5 (grundnivå) ===
  { word: "Ignorera", options: ["Uppmärksamma", "Strunta i", "Förstå", "Förklara"], correct: 1, difficulty: "grund" },
  { word: "Kontradiktion", options: ["Likhet", "Motsägelse", "Problem", "Förklaring"], correct: 1, difficulty: "grund" },
  { word: "Preciserad", options: ["Otydlig", "Noggrant angiven", "Snabb", "Tillfällig"], correct: 1, difficulty: "grund" },
  { word: "Reducera", options: ["Öka", "Minska", "Förklara", "Skapa"], correct: 1, difficulty: "grund" },
  { word: "Exponera", options: ["Dölja", "Visa", "Förklara", "Skydda"], correct: 1, difficulty: "grund" },
  { word: "Komplex", options: ["Enkel", "Invecklad", "Snabb", "Tydlig"], correct: 1, difficulty: "grund" },
  { word: "Stabil", options: ["Instabil", "Stadig", "Snabb", "Svår"], correct: 1, difficulty: "grund" },
  { word: "Flexibel", options: ["Stel", "Anpassningsbar", "Snabb", "Otydlig"], correct: 1, difficulty: "grund" },
  { word: "Permanent", options: ["Tillfällig", "Varaktig", "Snabb", "Otydlig"], correct: 1, difficulty: "grund" },
  { word: "Approximation", options: ["Exakt värde", "Uppskattning", "Problem", "Lösning"], correct: 1, difficulty: "grund" },

  // === MINI-TEST 6 (medelnivå) ===
  { word: "Lakonisk", options: ["Utförlig", "Kortfattad och kärnfull", "Otydlig", "Ironisk"], correct: 1, difficulty: "medel" },
  { word: "Repressiv", options: ["Frigörande", "Förtryckande", "Tillfällig", "Neutral"], correct: 1, difficulty: "medel" },
  { word: "Eklektisk", options: ["Enhetlig", "Blandad från olika källor", "Slumpmässig", "Enkel"], correct: 1, difficulty: "medel" },
  { word: "Prokrastinera", options: ["Påskynda", "Fördröja", "Förklara", "Avsluta"], correct: 1, difficulty: "medel" },
  { word: "Redundant", options: ["Nödvändig", "Överflödig", "Komplicerad", "Tillfällig"], correct: 1, difficulty: "medel" },
  { word: "Stringent", options: ["Slapp", "Logisk och konsekvent", "Snabb", "Tillfällig"], correct: 1, difficulty: "medel" },
  { word: "Affekterad", options: ["Naturlig", "Tillgjord", "Otydlig", "Snabb"], correct: 1, difficulty: "medel" },
  { word: "Perifer", options: ["Central", "Ytlig/vid sidan av", "Djup", "Viktig"], correct: 1, difficulty: "medel" },
  { word: "Intrikat", options: ["Enkel", "Invecklad", "Snabb", "Otydlig"], correct: 1, difficulty: "medel" },
  { word: "Korrelation", options: ["Orsak", "Samband", "Problem", "Slump"], correct: 1, difficulty: "medel" },

  // === MINI-TEST 7 (medelnivå) ===
  { word: "Konciliant", options: ["Stridbar", "Försonlig", "Passiv", "Neutral"], correct: 1, difficulty: "medel" },
  { word: "Diskrepans", options: ["Likhet", "Skillnad", "Problem", "Resultat"], correct: 1, difficulty: "medel" },
  { word: "Exorbitant", options: ["Rimlig", "Orimligt hög", "Låg", "Stabil"], correct: 1, difficulty: "medel" },
  { word: "Pragmatisk", options: ["Teoretisk", "Praktisk", "Slumpmässig", "Otydlig"], correct: 1, difficulty: "medel" },
  { word: "Subversiv", options: ["Stödjande", "Omstörtande", "Stabil", "Neutral"], correct: 1, difficulty: "medel" },
  { word: "Konsensus", options: ["Konflikt", "Enighet", "Problem", "Diskussion"], correct: 1, difficulty: "medel" },
  { word: "Ambiguös", options: ["Tydlig", "Tvetydig", "Enkel", "Snabb"], correct: 1, difficulty: "medel" },
  { word: "Premiss", options: ["Slutsats", "Förutsättning", "Problem", "Resultat"], correct: 1, difficulty: "medel" },
  { word: "Implodera", options: ["Explodera utåt", "Kollapsa inåt", "Växa", "Försvinna"], correct: 1, difficulty: "medel" },
  { word: "Valid", options: ["Felaktig", "Giltig", "Tillfällig", "Otydlig"], correct: 1, difficulty: "medel" },

  // === MINI-TEST 8 (svår nivå) ===
  { word: "Dogmatisk", options: ["Öppen", "Tvärsäker", "Osäker", "Neutral"], correct: 1, difficulty: "svar" },
  { word: "Divergens", options: ["Sammanfall", "Skillnad", "Problem", "Resultat"], correct: 1, difficulty: "svar" },
  { word: "Epokgörande", options: ["Ovanlig", "Banbrytande", "Tillfällig", "Kort"], correct: 1, difficulty: "svar" },
  { word: "Hegemoni", options: ["Jämlikhet", "Dominans", "Svaghet", "Neutral"], correct: 1, difficulty: "svar" },
  { word: "Konnotation", options: ["Bokstavlig betydelse", "Bibetydelse", "Problem", "Resultat"], correct: 1, difficulty: "svar" },
  { word: "Postulera", options: ["Bevisa", "Anta", "Förkasta", "Förklara"], correct: 1, difficulty: "svar" },
  { word: "Revidera", options: ["Behålla", "Ändra", "Förstöra", "Skapa"], correct: 1, difficulty: "svar" },
  { word: "Syntes", options: ["Uppdelning", "Sammanfogning", "Problem", "Konflikt"], correct: 1, difficulty: "svar" },
  { word: "Tvetydighet", options: ["Klarhet", "Oklarhet", "Problem", "Lösning"], correct: 1, difficulty: "svar" },
  { word: "Validitet", options: ["Fel", "Giltighet", "Problem", "Slump"], correct: 1, difficulty: "svar" },

  // === MINI-TEST 9 (svår nivå) ===
  { word: "Abnegation", options: ["Självuppoffring", "Själviskhet", "Problem", "Resultat"], correct: 0, difficulty: "svar" },
  { word: "Konform", options: ["Avvikande", "Anpassad", "Slumpmässig", "Neutral"], correct: 1, difficulty: "svar" },
  { word: "Ostentativ", options: ["Diskret", "Skrytsam", "Enkel", "Otydlig"], correct: 1, difficulty: "svar" },
  { word: "Pertinens", options: ["Relevans", "Problem", "Resultat", "Slump"], correct: 0, difficulty: "svar" },
  { word: "Rekursiv", options: ["Linjär", "Självrefererande", "Enkel", "Otydlig"], correct: 1, difficulty: "svar" },
  { word: "Sedermera", options: ["Tidigare", "Senare", "Nu", "Aldrig"], correct: 1, difficulty: "svar" },
  { word: "Tangentiell", options: ["Central", "Vid sidan av", "Viktig", "Tydlig"], correct: 1, difficulty: "svar" },
  { word: "Transient", options: ["Permanent", "Tillfällig", "Stabil", "Evig"], correct: 1, difficulty: "svar" },
  { word: "Utilitaristisk", options: ["Opraktisk", "Nyttoinriktad", "Slumpmässig", "Neutral"], correct: 1, difficulty: "svar" },
  { word: "Veritabel", options: ["Falsk", "Verklig", "Osäker", "Tillfällig"], correct: 1, difficulty: "svar" },

  // === MINI-TEST 10 (elitnivå) ===
  { word: "Admonition", options: ["Beröm", "Varning/tillrättavisning", "Problem", "Resultat"], correct: 1, difficulty: "elit" },
  { word: "Belligerent", options: ["Fredlig", "Stridslysten", "Neutral", "Passiv"], correct: 1, difficulty: "elit" },
  { word: "Cirkumventera", options: ["Konfrontera", "Gå runt", "Förklara", "Stoppa"], correct: 1, difficulty: "elit" },
  { word: "Derivativ", options: ["Ursprunglig", "Härledd", "Enkel", "Otydlig"], correct: 1, difficulty: "elit" },
  { word: "Emfas", options: ["Svaghet", "Betoning", "Problem", "Resultat"], correct: 1, difficulty: "elit" },
  { word: "Frivol", options: ["Seriös", "Lättsinnig", "Stabil", "Neutral"], correct: 1, difficulty: "elit" },
  { word: "Kapitulera", options: ["Segra", "Ge upp", "Kämpa", "Förklara"], correct: 1, difficulty: "elit" },
  { word: "Latent", options: ["Synlig", "Dold", "Tydlig", "Aktiv"], correct: 1, difficulty: "elit" },
  { word: "Manifest", options: ["Dold", "Tydlig", "Problem", "Resultat"], correct: 1, difficulty: "elit" },
  { word: "Obstruera", options: ["Hjälpa", "Hindra", "Förklara", "Skapa"], correct: 1, difficulty: "elit" }
];
