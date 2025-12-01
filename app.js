// Ein paar Start-Vokabeln
const defaultVocab = [
  { de: "Haus", es: "casa" },
  { de: "Baum", es: "árbol" },
  { de: "Auto", es: "coche" },
  { de: "Essen", es: "comida" },
  { de: "Trinken", es: "beber" },
];

const STORAGE_KEY = "vokabeltrainer_vocab";

let vocab = [];
let currentIndex = 0;
let currentDirection = "de-es";
let knownCount = 0;
let unknownCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  // DOM-Elemente holen
  const questionEl = document.getElementById("question");
  const answerEl = document.getElementById("answer");
  const showAnswerBtn = document.getElementById("show-answer");
  const knewItBtn = document.getElementById("knew-it");
  const didntKnowBtn = document.getElementById("didnt-know");
  const nextWordBtn = document.getElementById("next-word");
  const totalCountEl = document.getElementById("total-count");
  const knownCountEl = document.getElementById("known-count");
  const unknownCountEl = document.getElementById("unknown-count");

  const addForm = document.getElementById("add-word-form");
  const deInput = document.getElementById("de-input");
  const esInput = document.getElementById("es-input");

  const aiTopicInput = document.getElementById("ai-topic");
  const aiCountInput = document.getElementById("ai-count");
  const aiSuggestBtn = document.getElementById("ai-suggest");
  const aiStatusEl = document.getElementById("ai-status");

  // URL deines späteren KI-Backends (Platzhalter)
  // Wenn dein Backend steht, hier z. B.:
  // const AI_BACKEND_URL = "https://dein-backend-host/ai-vocab";
  const AI_BACKEND_URL = "https://DEIN-BACKEND-HOST/ai-vocab";

  // --- LocalStorage-Funktionen ---

  function loadVocab() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        vocab = JSON.parse(saved);
      } else {
        vocab = defaultVocab.slice();
        saveVocab();
      }
    } catch (e) {
      console.error("Fehler beim Laden aus LocalStorage:", e);
      vocab = defaultVocab.slice();
    }
  }

  function saveVocab() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
    } catch (e) {
      console.error("Fehler beim Speichern in LocalStorage:", e);
    }
  }

  // --- Statistik ---

  function updateStats() {
    totalCountEl.textContent = vocab.length;
    knownCountEl.textContent = knownCount;
    unknownCountEl.textContent = unknownCount;
  }

  // --- Kartenlogik ---

  function pickRandomIndex() {
    if (vocab.length === 0) {
      currentIndex = -1;
      return;
    }
    currentIndex = Math.floor(Math.random() * vocab.length);
  }

  function showCard() {
    if (!questionEl || !answerEl) return;

    if (vocab.length === 0 || currentIndex === -1) {
      questionEl.textContent = "Noch keine Vokabeln vorhanden.";
      answerEl.textContent = "";
      answerEl.classList.add("hidden");
      return;
    }

    const item = vocab[currentIndex];

    if (currentDirection === "de-es") {
