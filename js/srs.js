// global variables
var choicesObj = {
  Rock: "url('./img/stone.png')",
  Paper: "url('./img/paper.png')",
  Scissors: "url('./img/scissors.png')",
}
var choices = Object.keys(choicesObj);
var moveAI;
var movePlayer;
var roundCount = 0; 
var winsPlayer = 0; var draws = 0; var winsAI = 0;


// run game on button click
function handleClick(e) {
  moveAIfunc()
  movePlayer = e.target.id
  console.log('movePlayer: ' + movePlayer);
  console.log('moveAI: ' + moveAI);
  document.getElementById("mainImgPlayer").style.backgroundImage = choicesObj[movePlayer];
  document.getElementById("mainImgAI").style.backgroundImage = choicesObj[moveAI];
  compareChoices(moveAI,movePlayer);
  document.getElementById("roundNumber").innerHTML = "Round " + roundCount;
  document.getElementById("winCounterMe").innerHTML = winsPlayer;
  document.getElementById("drawCounter").innerHTML = draws;
  document.getElementById("winCounterAI").innerHTML = winsAI;
}

// event listener to react on input button clicks 
for (var i = 0; i < choices.length; i++) {
  var input = document.getElementById(choices[i])
  input.addEventListener('click', handleClick)
}

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
    console.log("1",choices.length, a ,b);
    winnerNone()
    return;
  }
  if (a == choices.length - 1 && b == 0) {
    console.log("2",choices.length, a ,b);
    winnerPlayer()
    return;
  }
  if (b == choices.length - 1 && a == 0) {
    console.log("3",choices.length, a ,b);
    winnerAI()
    return;
  }
  if (a > b) {
    console.log("4",choices.length, a ,b);
    winnerAI()
    return;
  }
  else {
    console.log("5",choices.length, a ,b);
    winnerPlayer()
    return;
  }
}

// styling + output text functions
function winnerPlayer() {
  document.getElementById("roundResPlayer").innerHTML = movePlayer;
    document.getElementById("roundResPlayer").setAttribute("style", "font-weight:900; color:rgb(51, 153, 255);");
  document.getElementById("roundOperator").innerHTML = "beats";
    document.getElementById("roundOperator").setAttribute("style", "font-weight:500; color:rgb(0, 0, 0);");
  document.getElementById("roundResAI").innerHTML = moveAI;
    document.getElementById("roundResAI").setAttribute("style", "font-weight:900; color:rgb(136, 136, 136);");
  document.getElementById("roundWinner").innerHTML = "Player wins";
  winsPlayer++;
}
function winnerAI() {
  document.getElementById("roundResPlayer").innerHTML = moveAI;
    document.getElementById("roundResPlayer").setAttribute("style", "font-weight:900; color:rgb(136, 136, 136);");
  document.getElementById("roundOperator").innerHTML = " beaten by ";
    document.getElementById("roundOperator").setAttribute("style", "font-weight:500; color:rgb(0, 0, 0);");
  document.getElementById("roundResAI").innerHTML = movePlayer;
    document.getElementById("roundResAI").setAttribute("style", "font-weight:900; color:rgb(51, 153, 255);");
  document.getElementById("roundWinner").innerHTML = "AI wins";
  winsAI++;
}
function winnerNone() {
  document.getElementById("roundResPlayer").innerHTML = "";
  document.getElementById("roundOperator").innerHTML = "Draw";
    document.getElementById("roundOperator").setAttribute("style", "font-weight:900; color:rgb(136, 136, 136);");
  document.getElementById("roundResAI").innerHTML = "";
  document.getElementById("roundWinner").innerHTML = "Nobody wins";
  draws++;
}


