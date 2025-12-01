const defaultVocab = [
  { de: "Haus", es: "casa" },
  { de: "Baum", es: "árbol" },
  { de: "Auto", es: "coche" },
];

let vocab = [];
const STORAGE_KEY = "vokabeltrainer_vocab";

function loadVocab() {
  const saved = localStorage.getItem(STORAGE_KEY);
  vocab = saved ? JSON.parse(saved) : defaultVocab;
}

function saveVocab() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
}

let currentIndex = 0;
let currentDirection = "de-es";
let knownCount = 0;
let unknownCount = 0;

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
const aiSuggestBtn = document.getElementById("ai-suggest");

function updateStats() {
  totalCountEl.textContent = vocab.length;
  knownCountEl.textContent = knownCount;
  unknownCountEl.textContent = unknownCount;
}

function pickRandomIndex() {
  currentIndex = Math.floor(Math.random() * vocab.length);
}

function showCard() {
  const item = vocab[currentIndex];

  if (currentDirection === "de-es") {
    questionEl.textContent = item.de;
    answerEl.textContent = item.es;
  } else {
    questionEl.textContent = item.es;
    answerEl.textContent = item.de;
  }
  answerEl.classList.add("hidden");
}

showAnswerBtn.addEventListener("click", () => {
  answerEl.classList.remove("hidden");
});

knewItBtn.addEventListener("click", () => {
  knownCount++;
  updateStats();
  nextCard();
});

didntKnowBtn.addEventListener("click", () => {
  unknownCount++;
  updateStats();
  nextCard();
});

nextWordBtn.addEventListener("click", nextCard);

document.querySelectorAll('input[name="direction"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    currentDirection = e.target.value;
    showCard();
  });
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  vocab.push({ de: deInput.value, es: esInput.value });
  saveVocab();
  updateStats();
  deInput.value = "";
  esInput.value = "";
});

aiSuggestBtn.addEventListener("click", () => {
  const demo = [
    { de: "Essen", es: "comida" },
    { de: "Trinken", es: "beber" },
    { de: "Reise", es: "viaje" },
  ];
  demo.forEach((w) => vocab.push(w));
  saveVocab();
  updateStats();
  alert("Demo-Vokabeln wurden hinzugefügt.");
});

function nextCard() {
  pickRandomIndex();
  showCard();
}

loadVocab();
updateStats();
nextCard();
