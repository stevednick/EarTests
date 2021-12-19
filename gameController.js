var buttons = document.querySelectorAll(".answer");
var startButton = document.querySelector(".start-button");
var scoreText = document.querySelector(".score-text");

var waitingForReset = false;
var scores = {"correct": 0, "attempted": 0};
var answeredWrong = false;

startButton.addEventListener("click", function(){
  nextNote();
});

for (i=0;i<buttons.length;i++){
  buttons[i].addEventListener("click", function(evt){
    if (answeredWrong == false){
      scores["attempted"] += 1;
    }
    if (noteNames[correctAnswer] == evt.target.childNodes[0].textContent){
      evt.target.childNodes[0].textContent = "Correct!";
      waitingForReset = true;
      setTimeout(function() { nextNote(true); }, 1500);
      if (answeredWrong) {
        answeredWrong = false;
      } else {
        scores["correct"] += 1;
      }
    } else {
      evt.target.childNodes[0].textContent = "Try Again!";
      answeredWrong = true;
    }
    updateScores();
  });
}

const noteNames = ["A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab"];
const aPitch = 440.0;

var currentNotes = [0, 0, 0, 0];
var correctAnswer = 0;

function getPitch(note, randomOctave = true){
  var noteToPlay = note;
  if (randomOctave){
    var randomOctave = Math.floor(Math.random() * 4) - 2;
    noteToPlay += randomOctave * 12;
  }
  return aPitch * Math.pow(2, noteToPlay/12);
}

nextNote();

function setButtonText(){
  for (i=0;i<buttons.length;i++){
    buttons[i].childNodes[0].textContent = noteNames[currentNotes[i]];
  }
}

function nextNote(autoPlay = false){
  if (autoPlay && (waitingForReset == false)){
    return;
  }
  for (i=0;i<buttons.length;i++){
    currentNotes[i] = Math.floor(Math.random()*12);
  }
  correctAnswer = currentNotes[Math.floor(Math.random()*4)];
  setButtonText();
  playNote(correctAnswer);
  waitingForReset = false;
}

function playNote(note){
  var context = new (window.AudioContext || window.webkitAudioContext)();
  var osc = context.createOscillator(); // instantiate an oscillator
  osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
  osc.frequency.value = getPitch(note);
  osc.connect(context.destination);
 // Hz
  osc.start(); // start the oscillator
  osc.stop(context.currentTime + 2); // stop 2 seconds after the current time
}

function updateScores(){
  scoreText.textContent = "Score: " + scores["correct"] + "/" + scores["attempted"];
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
