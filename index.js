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
let min = 0;
let max = 100;
let count = 0;
let computerGuess = 0;
let secretNumber = 0;

//produces a random number
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

//returns the point between two given integers
  function split(min, max) {
    return ((min+max)/2);
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

  async function youWin() {
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
    //assigns a number to variable computerGuess between 0-100 and trims the decimal place.
          computerGuess = split(min, max);
          computerGuess = Math.floor(computerGuess);
            await ask("Let's play a game where you (human) think of a number between 1 and 100 and I (the computer) will guess what it is.");
          //asks for the secret number and converts it to integer.
          secretNumber = await ask("What is your secret number? I won't peek, I promise...\n");
          secretNumber = parseInt(secretNumber);
          //uses a while loop to make sure it's a positive integer.
          while(!(Number.isInteger(secretNumber)) && !(secretNumber > 0)) {
            secretNumber = await ask(`Please enter a number between ${min+1} and ${max}.\n `)
          } //makes a guess and then increments count
          console.log(`In start, the secret number is ${secretNumber}.`);
          let input = await ask(`Is it... ${computerGuess}?\n`)
          count = count + 1;
          console.log(`Count is ${count} at this point.`);
      //if they say yes, checks to see if they're lying.
          if (ANSWERS_POS.includes(input)) {
            if (secretNumber === computerGuess) {
              //if not, declares victory message
            youWin(count, secretNumber);
          } else {
            //if so, asks them to answer again.
            console.log(`But you said it was ${secretNumber}.`);
            input = await ask(`Is it... ${computerGuess}?`)
          }
         } else if (ANSWERS_NEG.includes(input)) {
            //if they said no, good! we can ask if it's higher or lower.
            if (!(secretNumber === computerGuess)) {
            higherLower()
          } else {
            //unless the computer guessed right, in which case we can ask for the real response.
            console.log(`But you said that it was ${secretNumber}.`);
            input = await ask(`Is it... ${computerGuess}?`)
          } //asks for a yes or a no if response unintelligible.
        } input = await ask(`Please enter yes or no.`)
        }

//function higherLower uses nested if/else statements
  async function higherLower() {
  while (secretNumber > computerGuess) {
    let higher = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?\n`);
    sanitize(higher);
    if (ANSWERS_HIGH.includes(higher)) {
    //they're telling the truth and it makes a new guess
    min = computerGuess;
    computerGuess = Math.ceil(split(min, max));
    guess();
    } else if (ANSWERS_LOW.includes(higher)) {
      console.log(`But you already said it was higher than ${computerGuess}.`);
      higherLower();
    } else {
      console.log(`Please enter a valid response.`);
      higherLower();
    }
  } while (secretNumber < computerGuess) {
      let lower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?\n`);
      sanitize(lower);
      if (ANSWERS_LOW.includes(lower)) { 
        max = computerGuess;
        computerGuess = Math.floor(split(min, max));
        guess();
      } else if (ANSWERS_HIGH.includes(lower)) {
        console.log(`But you already said it was lower than ${computerGuess}.`);
        higherLower();
      } else {
        console.log(`Please enter a valid input.`)
      }
  }
}

async function guess() { 
    let answer = await ask(`Is your number... ${computerGuess}?`);
      //increments count
        count = count + 1;
        sanitize(answer);
      //if user says yes
        if (ANSWERS_POS.includes(answer)) {
          if (secretNumber === computerGuess) {
                youWin(count, secretNumber)
            } if (!(secretNumber === computerGuess)) {
                console.log(`Sure about that?`)
                answer = await ask(`Is your number... ${computerGuess}?\n`)
              }
             } else if (ANSWERS_NEG.includes(answer)) {
                 if (!(secretNumber === computerGuess)) {
                  higherLower();
              } else if (secretNumber === computerGuess){
                console.log(`Are you sure about that?`)
                  answer = await ask(`Is your number... ${computerGuess}?\n`)
              } answer = await ask(`Please type yes or no.`)
            }
          }