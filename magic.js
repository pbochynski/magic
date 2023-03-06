var stage = -1
var result = 0
var languages = ["en", "pl"]
var currentLang = 1
var levels = [{ max: 100, stages: 7 },
{ max: 250, stages: 8 },
{ max: 500, stages: 9 },
{ max: 1000, stages: 10 }
]
var currentLevel = 0
const MSG = {
  YES: { en: "Yes", pl: "Tak" },
  NO: { en: "No", pl: "Nie" },
  START: { en: "Start", pl: "Start" },
  NEW_GAME: { en: "New game", pl: "Nowa gra" },
  THINK: { en: "Think about the number between 1 and ", pl: "Pomyśl o liczbie z przedziału od 1 do " },
  IS_HERE: { en: "Is your number here?", pl: "Czy jest tu Twoja liczba?" },
  YOUR_NUMBER: { en: "Your number is: ", pl: "Twoja liczba to: " },
  LANGUAGE: { en: "Language", pl: "Język" },
  LEVEL: { en: "Level", pl: "Poziom" },
}
function msg(code) {
  return MSG[code][languages[currentLang]]
}
function pad(txt, len) {
  let p = "" + txt;
  while (p.length < len) {
    p = "\xa0" + p
  }
  return p
}
function card(nr) {
  let result = []
  for (let i = 1; i <= levels[currentLevel].max; ++i) {
    if (i & (1 << nr)) {
      result.push(pad(i, 4))
    }
  }
  return result.join(" ")
}
let cards = ""

function yesBtn() {
  return `<button class="btn success" onclick="next(1)">${msg("YES")}</button>\n`
}
function noBtn() {
  return `<button class="btn danger" onclick="next(0)">${msg("NO")}</button>\n`
}

function startBtn() {
  return `<button class="btn success" onclick="start()">${msg("START")}</button>\n`
}
function thinkTxt(max) {
  return `<h2>${msg("THINK")}${max}</h2>`
}
function onHashChange() {
  switch (window.location.hash) {
    case "#en": language(0)
      break;
    case "#pl": language(1)
      break;
  }
}

function start() {
  stage=0
  renderGame()
}
function renderStageProgress() {
  if (stage>=0) {
    let p=Math.round(stage*100/levels[currentLevel].stages)
    document.getElementById("progress").innerHTML= `<div class="w3-light-grey">
    <div class="w3-container w3-green w3-center" style="width:${p}%">${p}%</div>
  </div>`  
  } else {
    document.getElementById("progress").innerHTML=""
  }
}

function renderLevels() {
  let menu = `<button id="levelBtn" class="dropbtn">${msg("LEVEL")} <i class="fa fa-hashtag"></i></button>` +
    `<div class="dropdown-content">`
  for (let l = 0; l < levels.length; ++l) {
    let tick = (l == currentLevel) ? `<i class="fa fa-solid fa-check"></i>` : ""
    menu += `<a onclick="level(${l})">${tick}${levels[l].max}</a>`
  }
  menu += `</div>`
  document.getElementById("levels").innerHTML = menu
}

function renderLanguages() {
  let menu = `<button id="levelBtn" class="dropbtn">${msg("LANGUAGE")} <i class="fa fa-globe"></i></button>` +
    `<div class="dropdown-content">`
  for (let l = 0; l < languages.length; ++l) {
    let tick = (l == currentLang) ? '<i class="fa fa-solid fa-check"></i>' : ""
    menu += `<a onclick="language(${l})">${tick} ${languages[l].toUpperCase()}</a>`
  }
  menu += `</div>`
  document.getElementById("languages").innerHTML = menu
}

function renderGame() {
  renderStageProgress();
  renderLevels();
  renderLanguages();
  if (stage == -1) {
    document.getElementById("game").innerHTML = thinkTxt(levels[currentLevel].max)
    document.getElementById("buttons").innerHTML = startBtn()
  } else
    if (stage < levels[currentLevel].stages) {
      document.getElementById("game").innerHTML = `<h3>${msg("IS_HERE")}</h3><p class="p">${card(stage)}</p>`
      document.getElementById("buttons").innerHTML = yesBtn() + noBtn()
    } else {
      document.getElementById("game").innerHTML = `<h3>${msg("YOUR_NUMBER")}${result}</h3>`
      document.getElementById("buttons").innerHTML = ""
    }
  document.getElementById("new").text = msg("NEW_GAME")
}

function next(yes) {
  if (yes) {
    result += (1 << stage)
  }
  stage++
  renderGame()
}

function language(index) {
  currentLang = index
  renderGame()
}

function level(index) {
  currentLevel = index
  init()
}

function init() {
  stage = -1
  result = 0
  renderGame()
}

init()