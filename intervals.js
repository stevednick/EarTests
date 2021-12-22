//mvar scores = {"correct": 0, "attempted": 0};
function stateMachine(){
  this.waitingToStart = 0;
  this.notAnswered = 1;
  this.incorrectAnswer = 2;
  this.gameOver = 3;
}

function scores(){
  this.correct = 0;
  this.attempted = 0;
}

var states = new stateMachine();

const noteDelay = 500;
const resetDelay = 1500;

const gameLength = 15;


// var audio = {};
//
// for (i=1; i<25; i++){
//         audio[i] = new Audio();
//         audio[i].src = "sounds/key" + i + ".mp3"
// }

//$("#sound1").play();

var scores = new scores();
var currentNotes = [0, 0];
updateScores();

var currentState = states.waitingToStart;
var delayStart = new Date();

var intervals = [["Unison"],["Semitone", "Minor 2nd"], ["Major 2nd"], ["Minor Third"], ["Major 3rd"], ["Perfect 4th"],
                  ["Augmented 4th", "Diminished 5th"], ["Perfect 5th"], ["Augmented 5th", "Minor 6th"], ["Major 6th", "Diminished 7th"],
                  ["Minor 7th"], ["Major 7th"]];
var choices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const aPitch = 440.0;

var correctAnswer = 0;

$(".start-button").on('click', function(event) {
  startButtonClicked();
  $(".start-text").text("Replay Notes");
});

$(".answer").on('click', function(event) {
  checkAnswer(event);
});

function startButtonClicked(){
  if (currentState == states.gameOver){
    restart();
    return;
  }
  if (currentState == states.waitingToStart){
    getNotes();
  } else {
    playNotes();
  }
}

function getNotes(){
  shuffleArray(choices);
  correctAnswer = Math.floor(Math.random()*4);
  setButtonText();
  var firstNote = Math.floor(Math.random()*13) + 1;
  currentNotes = [firstNote, firstNote + choices[correctAnswer]];
  playNotes();
}

function checkAnswer(evt){
  if (currentState == states.waitingToStart){
    return;
  }
  var answerChosen = 0;
  switch ($(event.target).attr('class')) {
    case 'answer b':
      answerChosen = 1;
      break;
    case 'answer c':
      answerChosen = 2;
      break;
    case 'answer d':
      answerChosen = 3;
      break;
    default:
      break;
  }
  if (currentState == states.notAnswered){
    scores.attempted += 1;
  }

  if (correctAnswer == answerChosen){
    if (currentState == states.notAnswered){
      scores.correct += 1;
    }
    if (scores.attempted == gameLength){
      endGame();
      return;
    }
    setTimeout(function(){
      getNotes();
      currentState = states.notAnswered;
    }, resetDelay);
    evt.target.childNodes[0].textContent = "Correct!";
  } else {
    currentState = states.incorrectAnswer;
    evt.target.childNodes[0].textContent = "Try Again!";
  }
  updateScores();
}

function setButtonText(){
  $(".answer").each(function(index, el) {
    $(this).children().text(randomElement(intervals[choices[index]]));
  });
}

function endGame(){
  currentState = states.gameOver;
  $(".debug").text("Game Over! You scored " + scores.correct + "/" + gameLength);
  $(".start-text").text("Play Again");
}

function restart(){
  scores.attempted = 0;
  scores.correct = 0;
  getNotes();
  currentState = states.waitingToStart;
  $(".debug").text("");
  updateScores();
}

function playNotes(){
  playNote(currentNotes[0]);
  setTimeout(function(){
    playNote(currentNotes[1]);
    currentState = states.notAnswered;
  }, noteDelay);
  //debug();
}

function playNote(note){
  var playing = $("#sound" + note).get(0);
  playing.pause();
  playing.currentTime = 0;
  playing.play();
  // audio[note].pause();
  // audio[note].currentTime = 0;
  // audio[note].play();
}

function updateScores(){
  $(".score-text").text("Score: " + scores.correct + "/" + gameLength);
}

function randomElement(list){
  var ran = Math.floor(Math.random()*list.length);
  return list[ran];
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function debug(){
  $(".debug").text(currentNotes);
}
