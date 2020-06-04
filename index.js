const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//produces a random number based upon given parameters, inclusive on high and low ends
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

//finds and returns the exact middle value of two given numbers
  function splitNum(min, max) {
    return Math.round((min+max)/2);
  }

  function sanitize(input) {
    if (input === undefined) {
      console.log('Please enter a valid response.')
    } else {
    input = input[0].toLowerCase;
    return input;
    }
  }

async function guess (min, max, count, secretNumber, isHigh) {
  let myGuess = splitNum(min, max);
  /* if (isHigh === 'yes') {
    myGuess = Math.ceil(myGuess);
  } else {
    myGuess = Math.floor(myGuess);
  } */
  let input = await ask(`Is your number... ${myGuess}?`);
    count = count + 1;
    sanitize(input);
  if(yesAnswers.includes(input) && secretNumber == myGuess) {
    youWin(count, secretNumber);
  } else if(yesAnswers.includes(input)) {
    console.log(`But you said it was ${secretNumber}.`);
    process.exit();
  } else if (noAnswers.includes(input) && !(secretNumber === myGuess)) {
    highLow(min, max, count, secretNumber, myGuess)
  } else {
    console.log(`Input invalid.`)
  }
}

function sanitize(input) {
  input = input[0].toLowerCase;
  return input;
}

async function youWin(count, secretNumber) {
  await ask(`I got it right!`);
  if(secretNumber == 42) {
    await ask(`Your number was the answer to Life, the Universe, and Everything!`);
  } else {
  await ask(`Your number was ${secretNumber}!`);
  } if (count === 1) {
    await ask(`I guessed it in ${count} try.`)
  } else {
  await ask(`I guessed it in ${count} tries.`);
  }
  let newGame = await ask (`Play again? (Y/N)`);
  sanitize(newGame);
  if(yesAnswers.includes(newGame)) {
    start();
  } else {
    console.log(`Goodbye.`);
    process.exit()
  }
}

async function highLow(min, max, count, secretNumber, computerGuess) {
      //asks if it's higher or lower
      let higherLower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?`);
      sanitize(higherLower);
      if (highAnswers.includes(higherLower)) {
        //sets the new min to above the last guess and then makes a new guess
        min = computerGuess + 1;
        isHigh = 'yes';
        guess(min, max, count, secretNumber, isHigh);
        //if they say that it's lower
      } else if (lowAnswers.includes(higherLower)) {
        isHigh = 'no';
        //unless they already said it was higher
        if(guess === min) {
          console.log(`But you said it was higher than ${min}`)
        } else {
          //it sets a new max
        max = computerGuess - 1;
        //and makes a modified guess based on that output
        guess(min, max, count, secretNumber, computerGuess);
        }
      }
}

let yesAnswers = ['yes', 'y', 'it is'];
let noAnswers = ['no', 'n', 'nope', 'not'];
let highAnswers = ['higher', 'high', 'h'];
let lowAnswers = ['lower', 'low', 'l'];
let min = 1;
let max = 100;
let count = 0;
let playerNumber = ''

start();

async function start() {
  //decides the first guess and logs it out to the console.
  let computerGuess = randomNum(min, max);
  //declares rules of the game
  await ask("Let's play a game where you think of a number between 1 and 100 (inclusive) and I (the computer) will guess what it is.");
  //asks what the secret number is
  let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  playerNumber = secretNumber;
  let input = await ask(`Is your number... ${computerGuess}?`);
    sanitize(input);
    count = count + 1;
  //if player says yes and it matches the original secret number value
  if(yesAnswers.includes(input)) {
    youWin(count, secretNumber);
  } //if player says no
  if (noAnswers.includes(input)) {
    highLow(min, max, count, secretNumber, computerGuess)
  }
}
