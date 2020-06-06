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
      start();
    } else {
      console.log(`Goodbye.`);
      process.exit()
    }
  }

    start();

    async function start() {
    //assigns a number between 0-100 to computerGuess, trimming decimal place.
          computerGuess = split(min, max);
          computerGuess = Math.floor(computerGuess);
            await ask("Let's play a game where you (human) think of a number between 1 and 100 and I (the computer) will guess what it is.");
          //asks for the secret number and converts it to integer.
          secretNumber = await ask("What is your secret number? I won't peek, I promise...\n>_");
          secretNumber = parseInt(secretNumber);
          //must be a positive integer.
          while(!(Number.isInteger(secretNumber)) && !(secretNumber > 0)) {
            secretNumber = await ask(`Please enter a number between ${min+1} and ${max}.\n>_`)
          } guess();
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
    } else if (ANSWERS_LOW.includes(higher)) {
      console.log(`But you already said it was higher than ${computerGuess}.`);
      higherLower();
    //if they say neither higher nor lower, asks for a valid response
    } else {
      console.log(`Please enter a valid response.`);
      higherLower();
    }
    //while secretnumber is lower than guess
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
      } else if (ANSWERS_HIGH.includes(lower)) {
        console.log(`But you already said it was lower than ${computerGuess}.`);
        higherLower();
        //else asks for a valid input
      } else {
        console.log(`Please enter a valid input.`)
      }
  }
}

async function guess() { 
    let answer = await ask(`Is your number... ${computerGuess}?\n>_`);
        count = count + 1;
        sanitize(answer);
        //if they say that the secret number was guessed...
        if (ANSWERS_POS.includes(answer)) {
          //and it was, goes to win sequence
          if (secretNumber === computerGuess) {
                youWin()
          //If not it says "are you sure?" and asks again.
            } if (!(secretNumber === computerGuess)) {
                console.log(`Are you sure about that?`)
                answer = await ask(`Is your number... ${computerGuess}?\n>_`)
              }
          //if they say that the secret number was not guessed
             } else if (ANSWERS_NEG.includes(answer)) {
               //and it wasn't, we ask if it's higher or lower
                 if (!(secretNumber === computerGuess)) {
                  higherLower();
              //if it was, we say "sure about that?" and ask the same question again
              } else if (secretNumber === computerGuess){
                console.log(`Are you sure about that?`)
                  answer = await ask(`Is your number... ${computerGuess}?\n>_`)
            //if they neither say yes nor no, asks for yes or no input.
              } answer = await ask(`Please enter yes or no.`)
            }
          }