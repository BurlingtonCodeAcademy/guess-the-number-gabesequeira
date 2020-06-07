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
let max = 100;
let count = 0;
let computerGuess = 0;
let secretNumber = 0;
let game = 0;
let user = [];

//produces a random number
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

//split returns the point between two given integers
  function split(min, max) {
    return ((min+max)/2);
  }

//sanitize function converts string to lower case to be read by computer
  function sanitize(input) {
    if (input === undefined) {
      console.log('Please enter a valid response.')
    } else {
    input = input[0].toLowerCase;
    return input;
    }
  }

    start();

    function sanitizeNum() {

    }

    async function start() {
        console.log(`Welcome to Guess The Number! The game where you think of a number and the computer will guess what it is, or vice versa. The number is between a minimum and a maximum range.`);
        user = await ask(`First, tell me: What is your name?`)
        game = await ask (`Press (1) if you'd like think of the number first and let the computer guess, or if you prefer the computer to think of a number so ${user} can guess what it is, press (2).`);
        game = +game;
      while(game !== 1 || game !== 2) {
        console.log(`Please press either 1 or 2 and press [enter].`)
        game = await ask (
          `What version of guess the number would you like to play?`
          ); game = +game;
        } let min = await ask(`Now what would you like for the minimum range to be (above zero)?`);
      while(Number.isInteger(min) !== true || min <0) {
        console.log(`Please enter a positive integer of zero or greater.`);
        min = await ask(`What would you like to set for the minimum?`);
      } min = +min;
      let max = await ask(`What would you like for the maximum number to be?`);
      while(Number.isInteger(max) || max <= min) {
        console.log(`Please enter an integer greater than ${min}.`);
        max = await ask(`Please select a maximum value.`);
      } max = +max;
if (game === 1) {
        computerGuess = split(min, max);
        computerGuess = Math.floor(computerGuess);
          //asks for the secret number and converts it to integer.
              secretNumber = await ask("What is your secret number? I won't peek, I promise...\n");
              while (Number.isInteger(secretNumber) !== true || secretNumber < min || secretNumber > max) {
                console.log(`Please enter a whole number greater than ${min} and less than ${max}.`);
                secretNumber = await ask(`Now what will I be guessing?`)
              } guess();
            }
  if (game === 2) {
    console.log(`We'll get to this later.`)
  }
          }

    async function guess() {
    computerGuess = Math.ceil(computerGuess);
    let answer = await ask (`Is your number... ${computerGuess}?\n>_}`);
    count = count + 1;
    while (answer === undefined) {
      console.log(`Please enter yes or no.`);
      guess();
    }
    sanitize(answer);
    while (ANSWERS_POS.includes(answer)) {
      while (secretNumber === computerGuess) {
        youWin();
      } console.log(`Are you sure about that?`);
      guess();
    } while (ANSWERS_NEG.includes(answer)) {
      while (secretNumber !== computerGuess) {
        higherLower();
      } console.log(`Are you sure about that?`);
      guess();
    }
  }

//higherLower is a recursive function that uses while loops and if statements to get the right input from user. This is one way to solve it, but I know there's a way to refactor this code to be shorter.
  async function higherLower() {
    //while secret number is higher than guess
  while (secretNumber > computerGuess) {
    let higher = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?\n>_`);
    sanitize(higher);
    //if they say it was higher
    if (ANSWERS_HIGH.includes(higher)) {
    //they're telling the truth and it makes a new guess (rounding up)
    min = computerGuess;
    computerGuess = Math.ceil(split(min, max));
    guess();
    //if they say that it's lower, we know that they're lying and ask for a truthful input
    } else {
      console.log(`Are you sure?`);
      higherLower();
    } //while secretnumber is lower than guess
  } while (secretNumber < computerGuess) {
      let lower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?\n`);
      sanitize(lower);
      //if they say that it's lower
      if (ANSWERS_LOW.includes(lower)) { 
        //they're telling the truth and it makes a new guess
        max = computerGuess;
        computerGuess = Math.floor(split(min, max));
        guess();
        //otherwise it asks the question again
      } else {
        console.log(`Are you sure?`);
        higherLower();
      }
      }
  }

  async function youWin() {
    //displays win message, tells you number of tries and gives option to play another game
      console.log(`I got it right!`);
      console.log(`Your number was ${secretNumber}!`);
      if (count === 1) {
        console.log(`I guessed it in ${count} try.`)
      } else {
      console.log(`I guessed it in ${count} tries.`);
      }  let playAgain = await ask (`Play again? (Y/N)`);
      sanitize(playAgain);
      if(ANSWERS_POS.includes(playAgain)) {
    //if playagain = yes, program resets the game's variables and calls start again, else quits.
        min = 0;
        max = 100;
        computerGuess = 50;
        count = 0;
        start();
      } else {
        console.log(`Goodbye.`);
        process.exit()
      }
    }