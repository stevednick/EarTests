var buttons = document.querySelectorAll(".answer");
var startButton = document.querySelector(".start-button");
var scoreText = document.querySelector(".score-text");

var scores = {"correct": 0, "attempted": 0};

var states = new stateMachine();

const noteDelay = 500;
const resetDelay = 1500;

function stateMachine(){
  this.waitingToStart = 0;
  this.notAnswered = 1;
  this.incorrectAnswer = 2;
  this.waitingToReset = 3;
  this.waitingToPlaySecondNote = 4;
}

var currentNotes = [0, 0];

var currentState = states.waitingToStart;
var delayStart = new Date();

var intervals = [["Unison"],["Semitone", "Minor 2nd"], ["Major 2nd"], ["Minor Third"], ["Major 3rd"], ["Perfect 4th"],
                  ["Augmented 4th", "Diminished 5th"], ["Perfect 5th"], ["Augmented 5th", "Minor 6th"], ["Major 6th", "Diminished 7th"],
                  ["Minor 7th"], ["Major 7th"]];
var choices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const aPitch = 440.0;

var correctAnswer = 0;

startButton.addEventListener("click", function(){
  startButtonClicked();
});

for (i=0;i<buttons.length;i++){
  buttons[i].addEventListener("click", function(evt){
    checkAnswer(evt);
  });
}

let timer = setInterval(monitorTiming, 20);

function monitorTiming(){
  var currentDate = new Date();
  if (currentState == states.waitingToPlaySecondNote){
    if (currentDate - delayStart > noteDelay){
      playNote(currentNotes[1]);
      currentState = states.notAnswered;
    }
  } else if (currentState == states.waitingToReset){
    if (currentDate - delayStart > resetDelay){
      getNotes();
    }
  }
}

function startButtonClicked(){
  if (currentState == states.waitingToStart){
    getNotes();
  }
}

function getNotes(){
  shuffleArray(choices);
  correctAnswer = Math.floor(Math.random()*4);
  setButtonText();
  var firstNote = Math.floor(Math.random()*11) - 3;
  currentNotes = [firstNote, firstNote + choices[correctAnswer]];
  playNote(currentNotes[0]);
  delayStart = new Date();
  currentState = states.waitingToPlaySecondNote;
}

function checkAnswer(evt){
  if (currentState == states.waitingToStart){
    return;
  }
  var answerChosen = 0;
  switch (evt.path[0].className[7]) {
    case 'b':
      answerChosen = 1;
      break;
    case 'c':
      answerChosen = 2;
      break;
    case 'd':
      answerChosen = 3;
      break;
    default:
      break;
  }
  if (currentState == states.notAnswered){
    scores["attempted"] += 1;
  }

  if (correctAnswer == answerChosen){
    if (currentState == states.notAnswered){
      scores["correct"] += 1;
    }
    delayStart = new Date();
    currentState = states.waitingToReset;
    evt.target.childNodes[0].textContent = "Correct!";
  } else {
    currentState = states.incorrectAnswer;
    evt.target.childNodes[0].textContent = "Try Again!";
  }
  updateScores();
}

function getPitch(note, randomOctave = true){
  var noteToPlay = note;
  if (randomOctave){
    var randomOctave = Math.floor(Math.random() * 4) - 2;
    noteToPlay += randomOctave * 12;
  }
  return aPitch * Math.pow(2, noteToPlay/12);
}

function setButtonText(){
  for (i=0;i<buttons.length;i++){
    var nameToDisplay = randomElement(intervals[choices[i]]);
    buttons[i].childNodes[0].textContent = nameToDisplay;
  }
}

function playNote(note){
  var context = new (window.AudioContext || window.webkitAudioContext)();
  var osc = context.createOscillator(); // instantiate an oscillator
  osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
  osc.frequency.value = getPitch(note, false);
  osc.connect(context.destination);
 // Hz
  osc.start(); // start the oscillator
  osc.stop(context.currentTime + 2); // stop 2 seconds after the current time
}

function updateScores(){
  scoreText.textContent = "Score: " + scores["correct"] + "/" + scores["attempted"];
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
