//global variables
var cardSuits = ["club", "spade", "diamond", "heart"];
var cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var fullDeck = [];
var player;
var dealer;
var money = 1000;
var minBet = 100;
var winLoss = 0;
var bet;
var moneyDiv = document.getElementById("money");
var betDiv = document.getElementById("bet");
var gameResultDiv = document.getElementById("gameResult");
var coinDisplayDiv;
var cardsOnTable = 0;
moneyDiv.innerHTML = money + "€";
betDiv.value = minBet;

// card deck creation
function makeDeck() {
  for (var i = 0; i < cardSuits.length; i++) {
    for (var j = 0; j < cardValues.length; j++) {
      var weight = (j + 2);
      if (cardValues[j] == "J" || cardValues[j] == "Q" || cardValues[j] == "K")
      weight = 10;
      if (cardValues[j] == "A")
      weight = 1;
      var singleCard = {CardValue: cardValues[j], CardSuit: cardSuits[i], CardWeight: weight};
      fullDeck.push(singleCard);
    }
  }
}

// deck shuffler (fisher-yates)
function shuffleDeck(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// making cards
function makeCard(what, who, which) {
  cardsOnTable++;
  var currenthand = document.getElementById(who + "Cards");
  currenthand.appendChild(renderCard(what, which));
}
function renderCard(what, which) {
  if (what == "dealerFirst") {
    what = dealer.currentHand[0];
    var cardDiv = document.getElementById("dealerFirst")
  }  
  else {
    var cardDiv = document.createElement("div");
    var cardIcon = "";
    if (which === "init") {
      cardDiv.setAttribute("class", "card " + what.CardSuit + " card" + cardsOnTable + " init");
      cardDiv.setAttribute("id", "card"); 
    }
    else {
      cardDiv.setAttribute("class", "card " + what.CardSuit + " card" + cardsOnTable);
      cardDiv.setAttribute("id", "card"); 
      cardDiv.style.animation = "fade-in 1s";
    }
  }
  if (what.CardSuit == "club") {
    cardIcon = "&clubs;";
  }
  else if (what.CardSuit == "spade") {
    cardIcon = '&spades;';
  }
  else if (what.CardSuit == "diamond") {
    cardIcon = '&diams;';
  } 
  else {
    cardIcon = '&hearts;';
  }
  cardDiv.innerHTML = 
    '<span class="cardContent topLeft">' + what.CardValue + cardIcon + '</span>' + 
    '<span class="cardSuit">' + cardIcon + '</span>' + 
    '<span class="cardContent downRight">' + what.CardValue + cardIcon + '</span>';
  return cardDiv;
}

// 2 cards to player & dealer each 
// checking for blackjacks
function initDeal() {
  var init = "init";
  for (var i = 0; i < 2; i++) {
    card = fullDeck.pop()
    dealer.currentHand.push(card)
    makeCard(card, dealer.Name, init)
    if (i == 0) {
      document.getElementById("card").setAttribute("id", "dealerFirst"); 
      document.getElementById("dealerFirst").innerHTML = "  ";
      document.getElementById("dealerFirst").setAttribute("style", "background-image: url(./img/cardbackground.png);");
    }
    var card = fullDeck.pop();
    player.currentHand.push(card);
    makeCard(card, player.Name, init)
  }
  sumPoints(player)
  sumPoints(dealer)
  gameResultDiv.innerHTML = "Hit or Stand? You have " + player.combinedWeight + " points."
  console.log(player,dealer);
  disableToggle("newRound", true)
  if (dealer.combinedWeight == 21) {
    if (player.combinedWeight == 21) {
      disableToggle("hitMe", true)
      disableToggle("stand", true)
      setTimeout(() => endRound(false, "bothBJ"), 1000)
    }
    else {
      disableToggle("hitMe", true)
      disableToggle("stand", true)
      setTimeout(() => endRound(false, "dealerBJ"), 1000)
    }
  }
  else if (player.combinedWeight == 21) {
    disableToggle("hitMe", true)
    disableToggle("stand", true)
    setTimeout(() => endRound(true, "playerBJ"), 1000)
  }
}

// summing card values for each participant ""
// if ace = true and total+10 less than 21 --> ace value = 11;
function sumPoints(who) {
  var total = 0;
  var ace = false;
  for (var i = 0; i < who.currentHand.length; i++) {
    total += who.currentHand[i].CardWeight;//I LOVE MAGOCITA!
    if (who.currentHand[i].CardWeight == 1) {
      ace = true;
    }
  }
  if ( total + 10 <= 21 && ace) {
    total += 10; 
  }
  who.combinedWeight = total;
  document.getElementById("playerPoints").innerHTML = "&nbsp;&nbsp;(Score: " + player.combinedWeight + ")";
}

// deletes visuals, resets objects, starts the game
function newRound() {
  bet = betDiv.value;
  winLoss = "-" + bet + "€";
  profitDisplay("minus")
  document.getElementById("dealerPoints").innerHTML = "";
  document.getElementById("playerPoints").innerHTML = "";
  document.getElementById("dealerScore").innerHTML = "Dealer";
  document.getElementById("playerScore").innerHTML = "Player";
  gameResultDiv.innerHTML = "";
  disableToggle("bet", true)
  disableToggle("hitMe", false)
  disableToggle("stand", false)
  var allCards = document.querySelectorAll(".card");
  for (var i = 0; i < allCards.length; i++) {
    var removeCard = allCards[i];
    removeCard.remove();
  }  
  player = { Name: "player", combinedWeight: 0, currentHand: [] };
  dealer = { Name: "dealer", combinedWeight: 0, currentHand: [] };
  fullDeck = [];
  if (bet < minBet || bet > money) {
    gameResultDiv.innerHTML = "Please choose a bet between 100€ and your current balance (" + money + "€)";
    disableToggle("hitMe", true)
    disableToggle("stand", true)
    disableToggle("bet", false)
  }
  else {
    money = money - bet;
    moneyDiv.innerHTML = money + "€";
    makeDeck()
    shuffleDeck(fullDeck)
    initDeal()
  }
}

// hitme button
function hitMe() {
  disableToggle("hitMe", true)
  var card = fullDeck.pop();
  player.currentHand.push(card);
  makeCard(card, player.Name)
  sumPoints(player)
  if (player.currentHand.length !== 5 && player.combinedWeight < 21) {
  gameResultDiv.innerHTML = "Hit or Stand? You have " + player.combinedWeight + " points."
  setTimeout(() => disableToggle("hitMe", false) ,1000);
  }
  else if (player.combinedWeight > 21) {
    setTimeout(() => endRound(false, "playerOver21"), 1000)
  }
  else if (player.currentHand.length == 5 && player.combinedWeight < 21) {
    setTimeout(() => endRound(true, "5cards"), 1000)
  }
  else if (player.combinedWeight = 21) {
    disableToggle("hitMe", true)
    disableToggle("stand", true)
    gameResultDiv.innerHTML = "You have" + player.combinedWeight + "!! Proceeding with Dealer!"
    setTimeout(() => stand(),1500);
  }
}

// stand button
function stand() {
  renderCard("dealerFirst");
  document.getElementById("dealerFirst").setAttribute("style", "background-color: white");
  for (var i = 0; i < 5; i++) {
    if (dealer.combinedWeight <= 16 && dealer.currentHand.length < 5) {
        var card = fullDeck.pop();
        dealer.currentHand.push(card);
        makeCard(card, dealer.Name)
        sumPoints(dealer)
        console.log(player,dealer)
    }
    else {
      break;
    }
  } 
  if (dealer.combinedWeight > 21) {
    setTimeout(() => endRound(true, "dealerOver21"), 1000)
  }
  else if (dealer.combinedWeight > player.combinedWeight) {
    setTimeout(() => endRound(false, "lessPoints"), 1000)
  }
  else if (dealer.combinedWeight < player.combinedWeight) {
    setTimeout(() => endRound(true, "morePoints"), 1000)
  }
  else if (dealer.combinedWeight == player.combinedWeight) {
    setTimeout(() => endRound(false, "tie"), 1000)
  }
  if (dealer.currentHand.length == 5 && dealer.combinedWeight < 21) {
    setTimeout(() => endRound(false, "5cards"), 1000)
  }
}

function endRound(win, why) {
  cardsOnTable = 0;
  renderCard("dealerFirst");
  document.getElementById("dealerFirst").setAttribute("style", "background-color: white");
  document.getElementById("dealerPoints").innerHTML = "&nbsp;&nbsp;(Score: " + dealer.combinedWeight + ")";
  if (win == false && why == "tie") {
    gameResultDiv.innerHTML = "Tie, nobody wins!"
    winLoss = "+" + bet + "€";
    money = money + (bet*1);
    profitDisplay("draw")
  }
  else if (win == false && why == "playerOver21") {
    gameResultDiv.innerHTML = "YOU LOSE! You're over 21."
    document.getElementById("dealerFirst").setAttribute("style", "background-image: url(./img/cardbackground.png);");
    document.getElementById("dealerFirst").innerHTML = "";
    document.getElementById("dealerPoints").innerHTML = "";
  }
  else if (win == true && why == "dealerOver21") {
    gameResultDiv.innerHTML = " YOU WIN! Dealer is over 21!"
    money = money + (bet*2); 
    winLoss = "+" + (bet*2) + "€";
    profitDisplay("plus")
  }
  else if (win == true && why == "morePoints") {
    gameResultDiv.innerHTML = " YOU WIN! You have " + player.combinedWeight + " and Dealer has " + dealer.combinedWeight + "."
    money = money + (bet*2); 
    winLoss = "+" + (bet*2) + "€";
    profitDisplay("plus")
  }
  else if (win == false && why == "lessPoints") {
    gameResultDiv.innerHTML = " YOU LOSE! You have " + player.combinedWeight + " and Dealer has " + dealer.combinedWeight + "."
  }
  else if (win == false && why == "dealerBJ") {
    gameResultDiv.innerHTML = "YOU LOSE! Dealer has Blackjack."
  }
  else if (win == true && why == "playerBJ") {
    gameResultDiv.innerHTML = "YOU WIN! You have Blackjack."
    money = money + (bet*2); 
    winLoss = "+" + (bet*2) + "€";
    profitDisplay("plus")
  }
  else if (win == false && why == "bothBJ") {
    gameResultDiv.innerHTML = "YOU LOSE! Both have Blackjack."
  }
  else if (win == true && why == "5cards") {
    gameResultDiv.innerHTML = "YOU WIN! You have 5 cards and are still under 21."
    money = money + (bet*2); 
    winLoss = "+" + (bet*2) + "€";
    profitDisplay("plus")
    
  }
  else if (win == false && why == "5cards") {
    gameResultDiv.innerHTML = "YOU LOSE! Dealer has 5 cards and is still under 21."
  }
  disableToggle("hitMe", true)
  disableToggle("stand", true)
  disableToggle("newRound", false)
  disableToggle("bet", false)

  moneyDiv.innerHTML = money + "€";
  if (money < 100) {
    disableToggle("newRound", true)
    disableToggle("bet", true)
    coinDisplayDiv = document.createElement("div");
    coinDisplayDiv.setAttribute("id", "coinDisplay");
    coinDisplayDiv.innerHTML = " GAME OVER! You're out of coin."
    coinDisplayDiv.setAttribute("style", "font-size:18px; font-weight: 900; color:red")
    document.getElementById("coinDisplayParent").appendChild(coinDisplayDiv);
    betDiv.value = "GG!"
  }
}

function disableToggle(which, state) {
  document.getElementById(which).disabled = state; 
}

function profitDisplay(change) {
  if (document.body.contains(document.getElementById("coinDisplay"))) {
    coinDisplayDiv.remove();
  }
  coinDisplayDiv = document.createElement("div");
  coinDisplayDiv.setAttribute("id", "coinDisplay");
  coinDisplayDiv.innerHTML = winLoss;
  if (change == "plus") {
    coinDisplayDiv.setAttribute("style", "font-size:18px; font-weight: 900; color:green")
  }
  else if (change == "minus") {
    coinDisplayDiv.setAttribute("style", "font-size:18px; font-weight: 900; color:red")
  }
  else if (change == "draw") {
    coinDisplayDiv.setAttribute("style", "font-size:18px font-weight: 900;")
  }
  document.getElementById("coinDisplayParent").appendChild(coinDisplayDiv);
  setTimeout (() => fadeOut(coinDisplayDiv, 1500), 1000);
}

function fadeOut(what, speed) {
  var seconds = speed/1000;
  what.style.transition = "opacity "+seconds+"s ease";
  what.style.opacity = 0;
  setTimeout(function() {
    what.parentNode.removeChild(what);
  }, speed);
}
