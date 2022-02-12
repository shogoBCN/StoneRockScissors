// global variables
var choicesObj = {
  Rock: "url('./img/stone.png')",
  Paper: "url('./img/paper.png')",
  Scissors: "url('./img/scissors.png')",
}
var modeObj = {
  bestofthree: "Best of Three",
  bestoffive:  "Best of Five",
  endlessgame: "Endless Game",
}
var choices = Object.keys(choicesObj);
var gameModes = Object.keys(modeObj);
var moveAI;
var movePlayer;
var winnerRound;
var winnerGame;
var roundCount = 0; 
var winsPlayer = 0; var draws = 0; var winsAI = 0;
var requiredWins;
var gameModeButtons

disabler()
buttonMaker()
buttonEventListener()

// game mode button maker
function buttonMaker() {
  var modeButtonDiv = document.getElementById("modeButtonDiv");
  var buttonTitle = document.createElement("div");
    buttonTitle.setAttribute("id", "modeTitle");
    buttonTitle.innerHTML = "Choose Game Mode:";
    modeButtonDiv.appendChild(buttonTitle);
  var dynamicButton;
  for (var i = 0; i < gameModes.length; i++) {
    dynamicButton = document.createElement("button");
    dynamicButton.setAttribute("id", gameModes[i]);
    dynamicButton.setAttribute("class", "buttonSmall gameModeButtons")
    modeButtonDiv.appendChild(dynamicButton);
    dynamicButton.innerHTML = modeObj[gameModes[i]];
  } 
  gameModeButtons = document.querySelectorAll(".gameModeButtons");
  buttonEventListener() 
}

function buttonRemover() {
  for (var i = 0; i < gameModeButtons.length; i++) {
    var disableChoices1 = gameModeButtons[i];
    disableChoices1.remove();
    document.getElementById("modeTitle").innerHTML = modeObj[selectedMode];
    document.getElementById("modeTitle").setAttribute("style", "font-size:25px;")
  }
}

// select gameMode from buttons and pass relevant argument to game function
function buttonEventListener() {
  for (var i = 0; i < gameModeButtons.length; i++) {
    gameModeButtons[i].addEventListener("click", function() {
      selectedMode = this.id
      console.log("Game Mode: ", selectedMode);
        if (selectedMode == "bestofthree") {
          resetGame()
          enabler()
          buttonRemover()
          requiredWins = 2;
          return;
        }
        else if (selectedMode == "bestoffive") {
          enabler()
          resetGame()
          buttonRemover()
          requiredWins = 3;
          return;
        }
        else {
          enabler()
          resetGame()
          buttonRemover()
          requiredWins = 9999;
          return;
        }
    });
  }
}

// counters display in relevant html element
function displays() {
  document.getElementById("roundNumber").innerHTML = "Round " + roundCount;
  document.getElementById("winCounterMe").innerHTML = winsPlayer;
  document.getElementById("drawCounter").innerHTML = draws;
  document.getElementById("winCounterAI").innerHTML = winsAI;  
}

// resets all variables in the game
function resetGame() {
  roundCount = 0; 
  winsPlayer = 0; 
  draws = 0; 
  winsAI = 0;

  document.getElementById("roundResPlayer").innerHTML = "";  
  document.getElementById("roundOperator").innerHTML = "";  
  document.getElementById("roundResAI").innerHTML = "";  
  document.getElementById("roundWinner").innerHTML = "";  
  

  var toRemove = document.getElementById("winnerWho"); 
  if (toRemove !== null) {
    toRemove.remove();
    toRemove = document.getElementById("resetButton"); 
    toRemove.remove();
  } 
}

function removeFadeOut( el, speed ) {
  var seconds = speed/1000;
  el.style.transition = "opacity "+seconds+"s ease";
  el.style.opacity = 0;
  setTimeout(function() {
      el.parentNode.removeChild(el);
  }, speed);
}

function hardReset() {
  resetGame()
  displays()
  document.getElementById("roundNumber").innerHTML = "";
  removeFadeOut(document.getElementById('modeTitle'), 2000);
  setTimeout(buttonMaker, 2000)
}

// enables player buttons
function enabler() {
  for (var i = 0; i < choices.length; i++) {
    var toDisable = document.getElementById(choices[i])
    toDisable.disabled = false;
    document.getElementById("buttonOuter").setAttribute("class", "d-flex social-box justify-content-center");
  }
}

// disables player buttons + gameMode selectors
function disabler() {
  for (var i = 0; i < choices.length; i++) {
    var disableChoices = document.getElementById(choices[i])
    disableChoices.disabled = true;
    document.getElementById("buttonOuter").setAttribute("class", "d-flex social-box-disabled justify-content-center");
  }
}

// styling + output text functions
function winnerPlayer() {
  winnerRound = "Player";
  document.getElementById("roundResPlayer").innerHTML = movePlayer;
    document.getElementById("roundResPlayer").setAttribute("style", "font-weight:900; color:rgb(51, 153, 255);");
  document.getElementById("roundOperator").innerHTML = " beats ";
    document.getElementById("roundOperator").setAttribute("style", "font-weight:500; color:rgb(0, 0, 0);");
  document.getElementById("roundResAI").innerHTML = moveAI;
    document.getElementById("roundResAI").setAttribute("style", "font-weight:900; color:rgb(136, 136, 136);");
  document.getElementById("roundWinner").innerHTML = "Round winner: " + winnerRound;
  winsPlayer++;
}
function winnerAI() {
  winnerRound = "AI";
  document.getElementById("roundResPlayer").innerHTML = movePlayer;
    document.getElementById("roundResPlayer").setAttribute("style", "font-weight:900; color:rgb(136, 136, 136);");
  document.getElementById("roundOperator").innerHTML = " beaten by ";
    document.getElementById("roundOperator").setAttribute("style", "font-weight:500; color:rgb(0, 0, 0);");
  document.getElementById("roundResAI").innerHTML = moveAI;
    document.getElementById("roundResAI").setAttribute("style", "font-weight:900; color:rgb(51, 153, 255);");
  document.getElementById("roundWinner").innerHTML = "Round winner: " + winnerRound;
  winsAI++;
}
function winnerNone() {
  document.getElementById("roundResPlayer").innerHTML = "";
  document.getElementById("roundOperator").innerHTML = "Draw";
    document.getElementById("roundOperator").setAttribute("style", "font-weight:900; color:rgb(136, 136, 136);");
  document.getElementById("roundResAI").innerHTML = "";
  document.getElementById("roundWinner").innerHTML = "Round winner: Nobody";
  winnerRound = '';
  draws++;
}

// creates game end button + final stats
function createEndButton() {
var winnerWho = document.createElement('p');
  winnerWho.setAttribute("id", "winnerWho")
  winnerWho.setAttribute("style", "font-weight:900; font-size: 22px; color:rgb(51, 153, 255); border-top: 1px solid rgba(0,0,0,.1); padding-top: 25px;");
  winnerWho.innerHTML = winnerGame;
  document.getElementById("resultFrame").appendChild(winnerWho);
var winsgame = document.createElement('span');
  winsgame.setAttribute("id", "winsgame")
  winsgame.setAttribute("style", "font-weight:500; font-size: 22px; color:rgb(0, 0, 0); padding-top: 25px;");
  winsgame.innerHTML = " wins game";
  winnerWho.appendChild(winsgame);
var resetButton = document.createElement('button');
  resetButton.setAttribute('onclick', "hardReset()");
  resetButton.setAttribute("id", "resetButton")
  resetButton.setAttribute("class", "buttonSmall");
  resetButton.textContent = "Play Again?";
  document.getElementById("resultFrame").appendChild(resetButton);
  }

// event listener player selection buttons
var inputs = document.querySelectorAll(".inputButton");
for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("click", function() {
  movePlayer = this.id
  game(movePlayer)
  });    
}
  
// actual game
function game(movePlayer) {
  // checking choice, display choice IMG, call compareChoices function 
  moveAIfunc()
  document.getElementById("mainImgPlayer").style.backgroundImage = choicesObj[movePlayer];
  document.getElementById("mainImgAI").style.backgroundImage = choicesObj[moveAI];
  compareChoices(moveAI,movePlayer);
  gameEnd();
  displays();
  
  // AI control
  function moveAIfunc() {
    moveAI = choices[Math.floor(Math.random() * choices.length)]
  }

  // compare choices
  function compareChoices(a, b) {

    a = choices.indexOf(a);
    b = choices.indexOf(b);
    roundCount++;
    if (a == b) {
      winnerNone()
      return;
    }
    if (a == choices.length - 1 && b == 0) {
      winnerPlayer()
      return;
    }
    if (b == choices.length - 1 && a == 0) {
      winnerAI()
      return;
    }
    if (a > b) {
      winnerAI()
      return;
    }
    else {
      winnerPlayer()
      return;
    }
  }

  // game end
  function gameEnd() {
    if (winsPlayer == requiredWins) {
      winnerGame = "Player";
      disabler()
      createEndButton()
      return;
    }
    if (winsAI == requiredWins) {
      winnerGame = "AI";
      disabler()
      createEndButton()
      return;
    }
  }
}
