$(document).ready(function() {

  let timer = null;
  let highscore = [];
  let operators = [];
  const gameData = {
    settings: {},
    scores: {},
    problem: {}
  };

  // creates addition question
  const newAdditionQuest = function (min, max) {
    let a = Math.floor(Math.random() * (max - min) + min)
    let b = Math.floor(Math.random() * (max - min) + min)
    gameData.problem.a = a;
    gameData.problem.b = b;
    gameData.problem.result = a + b;
    $('#question').text(a + ' + ' + b)
  }

  // creates substraction question
  const newSubstractionQuest = function (min, max) {
    let b = Math.floor(Math.random() * (max - min) + min)
    let a = Math.floor(Math.random() * (max - b) + b)
    gameData.problem.a = a;
    gameData.problem.b = b;
    gameData.problem.result = a - b;
    $('#question').text(a + ' - ' + b)
  }

  // creates multiplication question
  const newMultiplicationQuest = function (min, max) {
    let a = Math.floor(Math.random() * (max - min) + min)
    let b = Math.floor(Math.random() * (max - min) + min)
    gameData.problem.a = a;
    gameData.problem.b = b;
    gameData.problem.result = a * b;
    $('#question').text(a + ' * ' + b)
  }

  // creates division question
  const newDivisionQuest = function (min, max) {
    let a = Math.floor(Math.random() * (max - min) + min)
    // function to create array with all possible divisors
    const bMaker = function (a) {
      let quotient = 0;
      let arr = [];
      for (let i = 1; i <= a; i++ ) {
        quotient = a / i;
        if (quotient === Math.floor(quotient)) {
          arr.push(i)
        }
      }
      return arr;
    }
    // randomly pick one possible divisor
    let bArr = bMaker(a);
    let b = bArr[Math.floor(Math.random() * bArr.length)];
    gameData.problem.a = a;
    gameData.problem.b = b;
    gameData.problem.result = a / b;
    $('#question').text(a + ' / ' + b)
  }

  // starts a new game 
  const newGame = function() {
    $('#timer').text('10');
    $('#timer').prop('style', 'color: black')
    if (!$('input[type=checkbox]').is(":checked")) {
      operators.push("plus");
      gameData.settings.operators = operators;
      $('#plus').prop( "checked", true );
    }
    gameData.settings.seconds = 10;
    gameData.settings.range = parseInt($('#limiterLabel').text());
    gameData.scores.thisScore = 0;
    $("#start").prop('disabled', true);
    $("#answer").prop('disabled', false);
    $('#answer').focus(); 
    timerFunc()
    questionSelection();
  }

  // end game function, once timer is 0
  const endGame = function() {
    $("#answer").prop('disabled', true);
    $("#start").prop('disabled', false);
    $('#answer').val('');
    window.clearInterval(timer);
    timer = null;
    gameData.settings.seconds = 10;
    highscoreFunc()
  }

  // grabs highest score from highscore array and displays it 
  const highscoreFunc = function () {
    gameData.scores.thisScore
    highscore.push(gameData.scores.thisScore);
    gameData.scores.highscore = highscore;
    let maxScore = Math.max.apply(null, gameData.scores.highscore);
    $('#highscore').text(maxScore);
  }
  
  // keyup reaction
  $('#answer').keyup(function() {
    if (gameData.settings.seconds == 3) { // removes red style when 3+
      $("#timer").removeAttr("style");
    }
    if (parseInt($(this).val()) == gameData.problem.result) {
      gameData.scores.thisScore++; 
      $('#thisScore').text(gameData.scores.thisScore);
      gameData.settings.seconds++;
      console.log(gameData);
      $('#timer').text(gameData.settings.seconds);
      $('#answer').val('');
      questionSelection();
    }
  });

  // timer
  var timerFunc = function () {
    let timeleft;
    if (!timer) {
      timer = setInterval(function () {
        timeleft = --gameData.settings.seconds;
        $('#timer').text(gameData.settings.seconds);

        if (gameData.settings.seconds <= 3) {
          $('#timer').prop('style', 'color: rgb(179, 24, 24)')
        }
        if (gameData.settings.seconds == 0) {
          endGame()
        }
      }, 1000); 
    }
  };

  $('#start').on('click', function() {
    newGame()
  });

  // populate array with math operators, based on checked checkboxes
  $('input[type=checkbox]').change(function() {
    if (this.checked) {
      operators.push($(this).attr('id'))
      gameData.settings.operators = operators
    }
    if (!this.checked) {
      operators = operators.filter(item => item !== $(this).attr('id'))
      gameData.settings.operators = operators
    }
  });

  // select random Quest
  const questionSelection = function() {
    let nextQuestion = gameData.settings.operators[Math.floor(Math.random() * gameData.settings.operators.length)];
    if (nextQuestion === "plus" ) {
      newAdditionQuest(1, gameData.settings.range);
    }
    if (nextQuestion === "minus" ) {
      newSubstractionQuest(1, gameData.settings.range);
    }
    if (nextQuestion === "multi" ) {
      newMultiplicationQuest(1, gameData.settings.range);
    }
    if (nextQuestion === "div" ) {
      newDivisionQuest(1, gameData.settings.range);
    }
    if (gameData.settings.operators.length === 0) {
      newAdditionQuest(1, gameData.settings.range);
    }
  }

});

// slider function
const limterEL = (value) => {
  $('#limiterLabel').text(`${value}`)
}