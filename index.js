const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//declares variables to determine user input, and stores them in arrays.
let ANSWERS_POS = ['yes', 'y', 'it is'];
let ANSWERS_NEG = ['no', 'n', 'nope', 'not'];
let ANSWERS_HIGH = ['higher', 'high', 'h'];
let ANSWERS_LOW = ['lower', 'low', 'l'];

//produces a random number based on the provided minimum and maximum values, inclusive on high and low ends
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

//returns the point between two given integers
  function split(min, max) {
    let theValue = Math.round((min+max)/2);
    return parseInt(theValue);
  }

//converts a string to lower case
  function sanitize(input) {
    if (input === undefined) {
      console.log('Please enter a valid response.')
    } else {
    input = input[0].toLowerCase;
    return input;
    }
  }

  async function youWin(count, secretNumber) {
    await ask(`I got it right!`);
    await ask(`Your number was ${secretNumber}!`);
    if (count === 1) {
      await ask(`I guessed it in ${count} try.`)
    } else {
    await ask(`I guessed it in ${count} tries.`);
    } playAgain();
  }

  async function playAgain() {
    let newGame = await ask (`Play again? (Y/N)`);
    sanitize(newGame);
    if(ANSWERS_POS.includes(newGame)) {
      start();
    } else {
      console.log(`Goodbye.`);
      process.exit()
    }
    }

    start();

    async function start() {
        //declares variables.
          let min = 1;
          let max = 100;
          let count = 0;
          //decides what the first guess will be.
          let computerGuess = randomNum(min, max);
            await ask("Let's play a game where you (human) think of a number between 1 and 100 and I (the computer) will guess what it is.");
          //asks to declare secret number
          let secretNumber = await ask("What is your secret number? I won't peek, I promise...\n");
          //converts to an integer.
          secretNumber = parseInt(secretNumber);
          //makes sure it's a positive integer.
          while(!(Number.isInteger(secretNumber)) && !(secretNumber > 0)) {
            secretNumber = await ask('Please enter a number between 1 and 100. ')
          }
          let input = await ask(`Is it... ${computerGuess}?`)
          //increments count because a guess has been made
          count = count + 1;
          while (ANSWERS_POS.includes(input))
          if (secretNumber === computerGuess) {
          //declares victory message
            youWin(count, secretNumber);
          //else calls user out and then quits
          } else {
            console.log(`But you said it was ${secretNumber}.`);
            input = await ask(`Is it... ${computerGuess}?`)
          } while (ANSWERS_NEG.includes(input)) {
          //if the computer guessed wrong
            if (!(secretNumber === computerGuess)) {
          //it will ask if it's higher or lower
            highLow(min, max, count, secretNumber, computerGuess)
          //else it calls user out and then asks the same question again
          } else {
            console.log(`But you said that it was ${secretNumber}.`);
            input = await ask(`Is it... ${computerGuess}?`)
          } input = await ask(`Please enter yes or no.`)
        }
        }

        async function highLow(min, max, count, secretNumber, computerGuess) {
          let higherLower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?`);
            sanitize(higherLower);
        //if they say it's higher
              if (ANSWERS_HIGH.includes(higherLower)) {
                if (secretNumber < computerGuess) {
                  console.log(`But you said it was lower than ${computerGuess}.`)
                  higherLower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?`);
                } else {min = computerGuess;
                guess(min, max, count, secretNumber);
                }
               } //when they say it's lower
            else if (ANSWERS_LOW.includes(higherLower)) {
                if (secretNumber > computerGuess) {
                  console.log(`But you said it was higher than ${computerGuess}`)
                  higherLower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?`);
                } else {
                max = computerGuess;
                guess(min, max, count, secretNumber, computerGuess);
                }
               } else {
                console.log(`Please say if it's higher or lower`);
                higherLower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?`);
                }
              }

        async function guess(min, max, count, secretNumber) {
          //makes up a new guess and converts to an integer
            let computerGuess = split(min, max);
            computerGuess = +computerGuess
            let input = await ask(`Is your number... ${computerGuess}?`);
          //increments count, sanitizes the input.
              count = count + 1;
              sanitize(input);
          //if user says yes
            if (ANSWERS_POS.includes(input)) {
              if (!(secretNumber === computerGuess)) {
                console.log(`But you said it was ${secretNumber}.`)
                input = await ask(`Is your number... ${computerGuess}?`)
              } else {
                youWin(count, secretNumber);
              }//if the player says no
             } else if (ANSWERS_NEG.includes(input)) {
//if the guess was not equal to secret number
                if (!(secretNumber === computerGuess)) {
//asks if it's higher or lower than guess
                  highLow(min, max, count, secretNumber, computerGuess)
                } else {
                  console.log(`But you said it was ${secretNumber}.`)
                  input = await ask(`Is your number... ${computerGuess}?`)
                } 
              }
            }