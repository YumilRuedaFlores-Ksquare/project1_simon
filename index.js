const square = document.querySelector('.square');
const squareContainer = document.querySelector('.square-container');
const btnStart = document.querySelector('#btn-start');
const colors = ['red', 'green', 'yellow', 'blue'];
const src = ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
                  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
                  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
                  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
                  "http://soundfxcenter.com/video-games/sonic-the-hedgehog/8d82b5_Sonic_Sega_Sound_Effect.mp3"];
const audio = [new Audio(src[0]),new Audio(src[1]),new Audio(src[2]),new Audio(src[3]),new Audio(src[4])];


let level = 0;
// Variable to store the sequence generated by the game
let gameSequence = [];
// Variable to store the clicked colors (player)
let playerSequence = [];
let audio_index = 0;

// function for button animation
const squareAnimation = (color) => {
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
  // it must be used every time the user fails
  resetPlayerRound();
  // Get game sequence
  gameSequence = nextSequence(options);
  // Show game sequence animation
  gameSequence.forEach((element, i) => {
    setTimeout(() => {
      squareAnimation(element);
    }, 800 * (i + 1));
  });
};
// Variable to know if the sequence was repeated correctly
let sequenceOK = false;
// Variable to store the player clicks
let playerClicks = 0;

// Function to show the animation when the color is clicked
// it calls the function "squareAnimation"
const playerRound = () => {
  // Add event to the container to get the color of clicked button
  squareContainer.addEventListener('click', (event) => {
    // Condition to confirm that a square is clicked
    if (event.target.classList.contains('square')) {
      const color = event.target.id;
      // calls animation for the button and passes the color
      console.log(colors.indexOf(color));
      audio[colors.indexOf(color)].play();
      squareAnimation(color);
      // Every click will be compared with the corresponding item in the gameSequence
      if (gameSequence[playerClicks] === color) {
        // Add color to the player sequence
        playerSequence.push(color);
        // Add 1 to variable that store the clicks
        playerClicks++;
        // Condition for generate the nextRound
        playerSequence.length == gameSequence.length
          ? (sequenceOK = true)
          : (sequenceOK = false);
        if (sequenceOK) {
          // Call to nextRound function (generate the next sequence)
          nextRound();
        }
      } else {
        // TODO: UserStory4 - alert the user that he failed, reset round and play game sequence again without adding a new color if hard mode is disabled
        // setTimeout for the animation of the button when player fails
        setTimeout(() => {
          console.log('Wrong!!! :c');
          // Reset variables related to the player
          resetPlayerRound();
        }, 300);
      }
    }
  });
};
// Function to start the game
const start = () => {
  // When we are in a game the button will be disabled
  btnStart.setAttribute('disabled', true);
 
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
