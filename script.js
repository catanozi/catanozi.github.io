import getWord from "./words.js";

const contentBtns = document.querySelector(".btns");
const contentGuessWord = document.querySelector(".guess-word");
const img = document.querySelector("img");
const contentClue = document.querySelector(".clue");
const btnNew = document.querySelector(".new");
const scoreElement = document.getElementById("score");
const rankingList = document.getElementById("ranking-list");

let indexImg;
let score = 100;

localStorage.removeItem("highScores");

let highScores = [];

btnNew.onclick = () => init();
init();

function init() {
  indexImg = 1;
  img.src = `img1.png`;
  score = 100;
  scoreElement.textContent = score;

  generateGuessSection();
  generateButtons();
  updateRanking();
}

function generateGuessSection() {
  contentGuessWord.textContent = "";

  const { word, clue } = getWord();
  const wordWithoutAccent = word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  Array.from(wordWithoutAccent).forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = "_";
    span.setAttribute("word", letter.toUpperCase());
    contentGuessWord.appendChild(span);
  });

  contentClue.textContent = `Dica: ${clue}`;
}

function wrongAnswer() {
  indexImg++;
  img.src = `img${indexImg}.png`;

  score -= 10;
  scoreElement.textContent = score;

  if (indexImg === 7) {
    setTimeout(() => {
      alert("Perdeu :/");
      saveScore();
      init();
    }, 100);
  }
}

function verifyLetter(letter) {
  const arr = document.querySelectorAll(`[word="${letter}"]`);

  if (!arr.length) {
    wrongAnswer();
    updateButtonColor(letter, 'incorrect');
    return;
  }

  arr.forEach((e) => {
    e.textContent = letter;
  });

  updateButtonColor(letter, 'correct');

  const spans = document.querySelectorAll(`.guess-word span`);
  const won = !Array.from(spans).find((span) => span.textContent === "_");

  if (won) {
    setTimeout(() => {
      alert("Ganhou!!!");
      saveScore();
      init();
    }, 100);
  }
}

function generateButtons() {
  contentBtns.textContent = "";

  for (let i = 97; i < 123; i++) {
    const btn = document.createElement("button");
    const letter = String.fromCharCode(i).toUpperCase();
    btn.textContent = letter;

    btn.onclick = () => {
      btn.disabled = true;
      verifyLetter(letter);
    };

    contentBtns.appendChild(btn);
  }
}

function updateButtonColor(letter, status) {
  const button = Array.from(document.querySelectorAll(".btns button"))
    .find(btn => btn.textContent === letter);
  if (button) {
    button.classList.add(status);
  }
}

function saveScore() {
  const name = prompt("Digite seu nome para o ranking:");
  if (name) {
    const uniqueId = Date.now();
    const newScore = { id: uniqueId, name, score };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);

    highScores = highScores.slice(0, 3);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    updateRanking();
  }
}

function updateRanking() {
  const topScores = highScores.slice(0, 3);

  const medals = ["🥇", "🥈", "🥉"];

  rankingList.innerHTML = topScores.map((scoreEntry, index) =>
    `<li>${medals[index]} ${scoreEntry.name}: ${scoreEntry.score}</li>`
  ).join('');
}
