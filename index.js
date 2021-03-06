const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//declares variables to determine user input, storing them in arrays.
let ANSWERS_POS = ['yes', 'y', 'it is', 'sure'];
let ANSWERS_NEG = ['no', 'n', 'nope', 'not'];
let ANSWERS_HIGH = ['higher', 'high', 'h'];
let ANSWERS_LOW = ['lower', 'low', 'l'];
//declares variables to determine the game's parameters, stores them globally so as to be seen and acted upon by all functions.
let min = 0;
let max = 0;
let count = 0;
let computerGuess = 0;
let secretNumber = 0;
let game = 0;
let user = [];
let computerScore = 0;
let userScore = 0;

//produces a random number
function randomNum() {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//split returns the point between two given integers
function split(min, max) {
  return ((min + max) / 2);
}

//sanitize function converts string to lower case to be read by computer
function sanitize(input) {
    return input[0].toLowerCase;
}

start();

async function start() {
  //exposition/intro
  console.log(`Welcome to Guess The Number! In this game, you will think of a number and the let the computer guess what it is, or you will guess what the computer's number will be. The number is between a minimum and a maximum range, which is set by the player.`);
  user = await ask(`First, tell me: What is your name?\n>_`);
  while (user === ``) {
    console.log(`Please enter a name.`);
    user = await ask(`What is your name?\n>_`)
  }
  initialize()
}

async function initialize() {
game = await ask(`Please press (1) if you'd like think of the number first and let the computer guess, or if you prefer the computer to think of a number so ${user} can guess what it is, press (2).\n>_`);
  game = +game; //coerces game to a number
  //the following line of code determines whether the player has entered a 1 or a 2 or another input entirely.
  while (Number.isInteger(game) !== true || game <= 0 || game >= 3) {
    console.log(`Please press either 1 or 2 and press [enter].`)
    game = await ask(`What version of guess the number would you like to play? \n>_`);
    game = +game;
  }
  game = +game;
  min = await ask(`Now, what should we set for the minimum value (zero or greater)?\n>_`);
  min = +min;
  while (Number.isInteger(min) !== true || min < 0) {
    console.log(`Please enter a positive integer of zero or greater.`);
    min = await ask(`What would you like to set for the minimum?\n>_`);
    min = +min;
  }
  max = await ask(`What would you like for the maximum number to be?\n>_`);
  max = +max;
  while (Number.isInteger(max) !== true || max <= min) {
    console.log(`Please enter an integer greater than ${min}.`);
    max = await ask(`Please select a maximum value.\n>_`);
    max = +max;
  }
  if (game === 1) {
    computerGuess = split(min, max);
    computerGuess = Math.floor(computerGuess);
    //asks for the secret number and converts it to integer.
    secretNumber = await ask("What is your secret number? I won't peek, I promise...\n>_");
    secretNumber = +secretNumber;
    //error checking
    while (Number.isInteger(secretNumber) !== true || secretNumber < min || secretNumber > max || secretNumber === 0) {
      console.log(`Please enter a whole number that's greater than ${min} and less than ${max}.`);
      secretNumber = await ask(`What would you like your secret number to be?\n>_`);
      secretNumber = +secretNumber;
    }
    guess();
  }
  if (game === 2) {
    secretNumber = parseInt(randomNum())
    let userGuess = await ask(`Got my number! Now, try to make a guess!\n>_`);
    while(answer === ``) {
      console.log(`Please enter yes or no.`);
      answer = await ask(`Try to guess my number.\n>_`);
    }
    sanitize(answer);
    if (userGuess === secretNumber) {
      count = count + 1;
      youWin()
    } else {

    }
    process.exit();
  }
}

async function guess() {
  let answer = await ask(`Is your number... ${computerGuess}?(Yes or no)\n>_`);
  count = count + 1;
  //we wait to sanitize input only once they have evtered a value, because sanitize cannot lowercase undefined.
  while(answer === ``) {
    console.log(`Please enter yes or no.`);
    answer = await ask(`Is your number... ${computerGuess}?\n>_`);
  }
  sanitize(answer);
  //makes sure user input 
  //while it is not the right guess
    while (ANSWERS_POS.includes(answer)) {
      if (secretNumber !== computerGuess) {
      console.log(`Are you sure about that?`);
      answer = await ask(`Is your number... ${computerGuess}?\n>_`);
      sanitize(answer);
    } if (secretNumber === computerGuess) {
      computerScore = computerScore + 1;
      return youWin();
    }
  }
    while (ANSWERS_NEG.includes(answer)) {
      if (secretNumber !== computerGuess) {
        return higherLower();
      }
      if (secretNumber === computerGuess) {
        console.log(`Please enter yes or no.`);
        answer = await ask(`Is your number... ${computerGuess}?\n>_`);
        sanitize(answer);
    }
  }
}

async function higherLower() {
  let higher = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?\n>_`);
  while (higher === ``) {
    console.log(`Please say if it's higher or lower.`);
    higher = await ask(`Is it higher or lower than ${computerGuess}?\n>_`);
  }
  sanitize(higher);
//we use a while loop to check potential user inputs and then coerce the code into responses based on existing conditions of variables.
if (secretNumber < computerGuess) {
  while (ANSWERS_HIGH.includes(higher)) {
    console.log(`You said it was lower than that.`)
    higher = await ask(`Is it higher or lower than ${computerGuess}?\n>_`);
    sanitize(higher);
  } if (ANSWERS_LOW.includes(higher)) {
    max = computerGuess;
    computerGuess = Math.floor(split(min, max));
    return guess();
}
}
if (secretNumber > computerGuess) {
  while (ANSWERS_LOW.includes(higher)) {
    console.log(`You said it was higher than that.`)
    higher = await ask(`Is it higher or lower than ${computerGuess}?\n>_`);
    sanitize(higher);
  } if (ANSWERS_HIGH.includes(higher)) {
    min = computerGuess;
    computerGuess = Math.ceil(split(min, max));
    return guess();
  }
}
}

async function youWin() {
  //displays win message, tells you number of tries and gives option to play another game
  if (game === 1) {
  console.log(`I got it right!`);
  console.log(`Your number was ${secretNumber}!`);
  if (count === 1) {
    console.log(`I guessed it in ${count} try.`)
  } else {
    console.log(`I guessed it in ${count} tries.`);
  } console.log(`Computer: ${computerScore}, ${user}: ${userScore}.`)
} else {
  console.log(`You guessed it!\nMy number was ${secretNumber}.`);
  if (count === 1) {
  console.log(`You guessed it in ${count} try.`)
  } else {
    console.log(`You guessed it in ${count} tries.`)
  } console.log(`Computer: ${computerScore}, ${user}: ${userScore}.`)
}
  let playAgain = await ask(`Play again? (Y/N)\n>_`);
  sanitize(playAgain);
  if (ANSWERS_POS.includes(playAgain)) {
    min = 0;
    max = 0;
    computerGuess = 0;
    count = 0;
    start();
  } else {
    console.log(`Goodbye.`);
    process.exit()
  }
}