const square = document.querySelector('.square');
const squareContainer = document.querySelector('.square-container');
const btnStart = document.querySelector('#btn-start');
const btnReStart = document.querySelector('#btn-restart');
const colors = ['red', 'green', 'yellow', 'blue'];
const src = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
                  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
                  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
                  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
                  "http://soundfxcenter.com/video-games/sonic-the-hedgehog/8d82b5_Sonic_Sega_Sound_Effect.mp3",
                  "https://www.myinstants.com/media/sounds/erro.mp3"];
const audio = [new Audio(src[0]),new Audio(src[1]),new Audio(src[2]),new Audio(src[3]),new Audio(src[4]),new Audio(src[5])];
const toggleHardmode = document.querySelector('input[id="hard"]');

let level = 0;
// Variable to store the sequence generated by the game
let gameSequence = [];
// Variable to store the clicked colors (player)
let playerSequence = [];
// Variable to set the Hard-mode
let hardMode = 0;

let show = 1;


const vibration = [
  { transform: 'translate3d(-3px, 0, 0)' },
  { transform: 'translate3d(4px, 0, 0)' },
  { transform: 'translate3d(-8px, 0, 0)'},
  { transform: 'translate3d(8px, 0, 0)' },

];
const vibrationTiming = {
  duration: 2,
  iterations: 20,
}

// function for button animation
const squareAnimation = (color) => {

  //Give a sound based of the color
  audio[colors.indexOf(color)].play();
  // Variable for select button using the color clicked
  const square = document.querySelector(`.square-${color}`);
  // Add styles to the color button clicked
  square.classList.add('pushed');

  // Remove styles after 200 milliseconds for push effect
  setTimeout(() => {
    square.classList.remove('pushed');
  }, 200);
  
}; 

//function for give an animation to the container when an error occurs
const shakeError = () =>{
  audio[5].play();
  const square = document.querySelector('.square-container');
  square.animate(vibration,vibrationTiming);

}
const circleAnimation = () => {
  const circleStart = document.querySelector('.circle');
  circleStart.classList.add('pushed');
  setTimeout(() => {
    circleStart.classList.remove('pushed');
    
  }, 200);
};
// Function to get a random number between 0 and 3
// IT will be used to generate the game sequence
const nextColor = () => {
  min = 0;
  max = 3;
  idColor = Math.floor(Math.random() * (max - min + 1) + min);
  return colors[idColor];
};
// Function to generate the game sequence
const nextSequence = (options = { withNewColor: true }) => {
  //Re-active my reStart button

  // if (withNewColor == undefined) withNewColor = true;
  let nextSequence = [];
  nextSequence = [...gameSequence];
  // console.log(nextSequence);
  if (options.withNewColor) {
    const color = nextColor();
    // console.log(color);
    nextSequence.push(color);
  }
  // console.log('nextseq', nextSequence);
  return nextSequence;
};
//  Function to reset variables related to the player
// Used when player fails
const resetPlayerRound = () => {
  sequenceOK = false;
  playerSequence = [];
  playerClicks = 0;
};

// Function to generate next sequence and show animation
const nextRound = (options = { withNewColor: true }) => {
  // reset variables related to the player
  btnReStart.removeAttribute('disabled', true);

  // it must be used every time the user fails
  resetPlayerRound();
  // Get game sequence
  gameSequence = nextSequence(options);
    //Shows the steps in the pattenr;
  levelPattern(gameSequence);
  // Show game sequence animation
  setTimeout(animationSequence,1000);
};
//Show animation sequence
const animationSequence = () => {
  
  gameSequence.forEach((element, i) => {
    setTimeout(() => {
      squareAnimation(element);
    }, 800 * (i + 1));
  });
  
  
}
//shows the nummber of steps in the pattern
const levelPattern = (array) => {
    //Shows the steps in the pattenr;
    const lev = document.querySelector('#level');
    lev.textContent = array.length;
}
// Variable to know if the sequence was repeated correctly
let sequenceOK = false;
// Variable to store the player clicks
let playerClicks = 0;

// Function to show the animation when the color is clicked
// it calls the function "squareAnimation"
const playerRound = () => {
  //activate the buttons
  
  // Add event to the container to get the color of clicked button
  squareContainer.addEventListener('click', (event) => {
    // Condition to confirm that a square is clicked
    if (event.target.classList.contains('square')) {
      const color = event.target.id;
      // Every click will be compared with the corresponding item in the gameSequence
      if (gameSequence[playerClicks] === color) {
        // calls animation for the button and passes the color
        squareAnimation(color);
        //audio[colors.indexOf(color)].play();
        // Add color to the player sequence
        playerSequence.push(color);
        // Add 1 to variable that store the clicks
        playerClicks++;
        // Condition for generate the nextRound
        playerSequence.length == gameSequence.length
          ? (sequenceOK = true)
          : (sequenceOK = false);
        if (sequenceOK) {
          //Condition to win the game
          if(gameSequence.length <20){
          // Call to nextRound function (generate the next sequence)
          setTimeout(nextRound,800);
          }else{

            dbox("Congratulation!!! You are the WINNER! Click Start to start a new game")
            //Show the message to the winner!!
            level = 0;
            // Variable to store the sequence generated by the game
             gameSequence = [];
            // Variable to store the clicked colors (player)
             playerSequence = [];
             //reStart the match
            //setTimeout(nextRound,800);
          }
        }
      } else {
        //If the user fail in the hard mode, I reStart all the game
        if(hardMode){
          shakeError();
          resetPlayerRound();
          
          setTimeout(() => {
            //Gives an error sign that the pattern was incorrect
            shakeError();
            //reset all
            gameSequence = [];
            level = 1;
            resetPlayerRound();
            //Show the player again the sequence
            setTimeout(nextRound,1000);
          }, 300);
        }
        else{
        // TODO: UserStory4 - alert the user that he failed, reset round and play game sequence again without adding a new color if hard mode is disabled
        // setTimeout for the animation of the button when player fails
        
        setTimeout(() => {
          //Gives an error sign that the pattern was incorrect
          shakeError();
          console.log('Wrong!!! :c');
          // Reset variables related to the player
          resetPlayerRound();
          //Show the player again the sequence
          setTimeout(animationSequence,1000);
        }, 300);
      }
      }
    }
  });
};

// Winner!
function dbox (msg) {
  if (msg != undefined) {
    document.getElementById("boxTxt").innerHTML = msg;
    document.getElementById("boxBack").classList.add("show");
  } else { document.getElementById("boxBack").classList.remove("show"); }
}

// Function to start the game
const start = () => {
  // When we are in a game the button will be disabled
  
  btnReStart.removeAttribute('disabled', true);
  btnStart.setAttribute("disabled",true);

  // Start the round
  setTimeout(nextRound,2000);
  // Start to listen click button events
  playerRound();
};
// Eventlistener for the start button
btnStart.addEventListener('click', () => {
  audio[4].play();
  // Calls the animation for button start
  circleAnimation();
  // Starts the game
  start();
});

btnReStart.addEventListener('click', () =>{
  
  //If I use the reStart one time, I put it disable
  circleAnimation();
  btnReStart.setAttribute('disabled', true);

  // Show game sequence animation
  animationSequence();

});

//HARD - MODE
//funtion for the toggle button 
//If you change the state, the play will start again
toggleHardmode.onchange = function() {
  if(toggleHardmode.checked) {
    hardMode = 1;
  } else {
    hardMode = 0;
  }
};