//global variables
var fullDeck = [];

// card deck creation
var cardSuits = ["club", "spade", "diamond", "heart"];
var cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
function makeDeck() {
  for (var i = 0; i < cardSuits.length; i++) {
    for (var j = 0; j < cardValues.length; j++) {
      var singleCard = {CardValue: cardValues[j], CardSuit: cardSuits[i]};
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

makeDeck()
console.log(fullDeck);
shuffleDeck(fullDeck)
console.log(fullDeck);