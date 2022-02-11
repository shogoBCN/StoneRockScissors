// global variables
var choicesObj = {
  Rock: "url('./img/stone.png')",
  Paper: "url('./img/paper.png')",
  Scissors: "url('./img/scissors.png')",
}
var choices = Object.keys(choicesObj);
var moveAI;
var movePlayer;
var winnerRound;
var winnerGame;
var roundCount = 0; 
var winsPlayer = 0; var draws = 0; var winsAI = 0;
var selectedMode;

// select gameMode from checkboxes and pass relevant argument to game function
var gameModes = document.querySelectorAll('input[name="radio"]');
for (var i = 0; i < gameModes.length; i++) {
  gameModes[i].addEventListener("click", function() {
    selectedMode = this.id
    console.log(selectedMode);
      if (selectedMode == "bestOfThree") {
        resetGame();
        game(2)
        return;
      }
      else if (selectedMode == "bestOfFive") {
        resetGame();
        game(3)
        return;
      }
      else {
        resetGame();
        game(99999)
        return;
      }
  });
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
  console.log("resetGame");
  moveAI = 0;
  movePlayer = 0;
  winnerRound = 0;
  winnerGame = 0;
  roundCount = 0; 
  winsPlayer = 0; 
  draws = 0; 
  winsAI = 0;
  selectedMode = '';
  requiredWins = '';

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
  displays()  
}

function resetRadio() {
  gameModes = document.querySelectorAll('input[name="radio"]'); 
  for (var i = 0; i < gameModes.length; i++) {
    document.checkboxes.radio[i].checked=false;
  }
}

function hardReset() {
  resetGame()
  resetRadio()
}

// enables player buttons
function enabler() {
  for (var i = 0; i < choices.length; i++) {
    var toDisable = document.getElementById(choices[i])
    toDisable.disabled = false;
    document.getElementById("buttonOuter").setAttribute("class", "d-flex social-box justify-content-center");
  }
}

// disables player buttons
function disabler() {
  for (var i = 0; i < choices.length; i++) {
    var toDisable = document.getElementById(choices[i])
    toDisable.disabled = true;
    document.getElementById("buttonOuter").setAttribute("class", "d-flex social-box-disabled justify-content-center");
  }
}

// styling + output text functions
function winnerPlayer() {
  console.log("winnerPlayer");
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
  console.log("winnerAI");
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
  console.log("winnerNone");
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
  console.log("createEndButton");
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

// actual game
function game(requiredWins) {
  console.log("game");
  enabler()

  var inputs = document.querySelectorAll(".inputButton");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("click", function() {
    movePlayer = this.id
    handleClick(movePlayer)
    });    
  }

  // checking choice, display choice IMG, call compareChoices function 
  function handleClick(buttonID) {
    console.log("handleClick");
    moveAIfunc()
    movePlayer = buttonID;
    console.log('movePlayer: ' + movePlayer);
    console.log('moveAI: ' + moveAI);
    document.getElementById("mainImgPlayer").style.backgroundImage = choicesObj[movePlayer];
    document.getElementById("mainImgAI").style.backgroundImage = choicesObj[moveAI];
    compareChoices(moveAI,movePlayer);
    console.log("requiredWins", requiredWins);
    gameEnd();
    displays();
  }

  // AI control
  function moveAIfunc() {
    moveAI = choices[Math.floor(Math.random() * choices.length)]
  }

  // compare choices
  function compareChoices(a, b) {
    console.log("compareChoices");
    a = choices.indexOf(a);
    b = choices.indexOf(b);
    console.log("requiredWins", requiredWins);
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
    console.log("gameEnd");
    console.log(requiredWins,winsPlayer,winsAI);
    if (winsPlayer == requiredWins) {
      console.log(requiredWins,winsPlayer,winsAI);
      winnerGame = "Player";
      disabler()
      createEndButton()
      return;
    }
    if (winsAI == requiredWins) {
      console.log(requiredWins,winsPlayer,winsAI);
      winnerGame = "AI";
      disabler()
      createEndButton()
      return;
    }
  }
}

