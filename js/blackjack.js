//global variables
var cardSuits = ["club", "spade", "diamond", "heart"];
var cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var fullDeck = [];
var player;
var dealer;

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

function makeCard(what, who) {
  var currenthand = document.getElementById(who + "Cards");
  currenthand.appendChild(renderCard(what));
}
function renderCard(what) {
  var cardDiv = document.createElement("div");
  var cardIcon = "";
  cardDiv.setAttribute("class", "card");
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
    cardDiv.innerHTML = what.CardValue + cardIcon;
    return cardDiv;
}

// 2 cards to player & dealer each 
// checking for blackjacks
function initDeal() {
  for (var i = 0; i < 2; i++) {
    var card = fullDeck.pop();
    player.currentHand.push(card);
    makeCard(card, player.Name)
    card = fullDeck.pop();
    dealer.currentHand.push(card);
    makeCard(card, dealer.Name)
  }
  sumPoints(player)
  sumPoints(dealer)
  console.log(player,dealer);
  document.getElementById("newGame").disabled = true;
  if (dealer.combinedWeight == 21) {
    if (player.combinedWeight == 21) {
      endGame(false, "bothBJ")
    }
    else {
      endGame(false, "dealerBJ")
    }
  }
  else if (player.combinedWeight == 21) {
    endGame(true, "playerBJ")
  }
}

// summing card values for each participant 
// if ace = true and total+10 less than 21 --> ace value = 11;
function sumPoints(who) {
  var total = 0;
  var ace = false;
  for (var i = 0; i < who.currentHand.length; i++) {
    total += who.currentHand[i].CardWeight;
    if (who.currentHand[i].CardWeight == 1) {
      ace = true;
    }
  }
  if ( total + 10 <= 21 && ace) {
    total +=10; 
  }
  who.combinedWeight = total;
  document.getElementById(who.Name + "Points").innerHTML = who.combinedWeight;
}

// deletes visuals, resets objects, starts the game
function newGame() {
  document.getElementById("gameResult").innerHTML = "";
  document.getElementById("hitMe").disabled = false;
  document.getElementById("stand").disabled = false;
  var allCards = document.querySelectorAll(".card");
  for (var i = 0; i < allCards.length; i++) {
    var removeCard = allCards[i];
    removeCard.remove();
  }  
  player = { Name: "player", combinedWeight: 0, currentHand: [] };
  dealer = { Name: "dealer", combinedWeight: 0, currentHand: [] };
  fullDeck = [];
  makeDeck()
  shuffleDeck(fullDeck)
  initDeal()
  }

// hitme button
function hitMe() {
  var card = fullDeck.pop();
  player.currentHand.push(card);
  makeCard(card, player.Name)
  sumPoints(player)
  console.log(player,dealer);
  pointsCheck()
}

function pointsCheck() {
  if (player.combinedWeight > 21) {
    endGame(false, "over21")
  }
}


function stand() {
  for (var i = 0; i < 5; i++) {
    if (dealer.combinedWeight <= 16 && dealer.currentHand.length < 5) {
      var card = fullDeck.pop();
      dealer.currentHand.push(card);
      sumPoints(dealer)
      console.log(player,dealer);
    }
    else {
      break;
    }
  }  
}


function endGame(win, why) {
  if (win == false && why == "over21") {
    document.getElementById("gameResult").innerHTML = "So sorry, you're over 21 and YOU LOSE!"
  }
  else if (win == true && why == "over21") {
    document.getElementById("gameResult").innerHTML = "YAY! Dealer is over 21! YOU WIN!"
  }
  else if (win == true && why == "lessPoints") {
    document.getElementById("gameResult").innerHTML = "You have " + player.combinedWeight + " and Dealer has " + dealer.combinedWeight + ". YOU WIN!"
  }
  else if (win == false && why == "lessPoints") {
    document.getElementById("gameResult").innerHTML = "You have " + player.combinedWeight + " and Dealer has " + dealer.combinedWeight + ". YOU LOSE!"
  }
  else if (win == false && why == "dealerBJ") {
    document.getElementById("gameResult").innerHTML = "Dealer has Blackjack. YOU LOSE!"
  }
  else if (win == true && why == "playerBJ") {
    document.getElementById("gameResult").innerHTML = "You have Blackjack. YOU WIN!"
  }
  else if (win == false && why == "bothBJ") {
    document.getElementById("gameResult").innerHTML = "Both have Blackjack. YOU LOSE!"
  }
  document.getElementById("hitMe").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("newGame").disabled = false;
}
