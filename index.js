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

  function sanitize(input) {
    if (input === undefined) {
      console.log('Please enter a valid response.')
    } else {
    input = input[0].toLowerCase;
    return input;
    }
  }

async function guess (min, max, count, secretNumber) {
  let myGuess = randomNum(min, max)
  let input = await ask(`Is your number... ${myGuess}?`);
    count = count + 1;
    console.log(count);
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
  if(secretNumber === 42) {
    await ask(`Your number was the answer to Life, the Universe, and Everything!`);
  } else {
  await ask(`Your number was ${secretNumber}!`);
  }
  await ask(`I guessed it in ${count} tries.`);
  let newGame = await ask (`Play again? (Y/N)`);
  sanitize(newGame);
  if(yesAnswers.includes(newGame)) {
    start();
  } else {
    console.log(`Goodbye.`)
  }
  process.exit();
}

async function highLow(min, max, count, secretNumber, computerGuess) {
      //asks if it's higher or lower
      let higherLower = await ask(`Is it higher (h) or lower (l) than ${computerGuess}?`);
      sanitize(higherLower);
      if (highAnswers.includes(higherLower)) {
        //sets the min to the previous guess
        min = computerGuess;
      //then makes a new guess
        guess(min, max, count, secretNumber, computerGuess);
        //if they say that it's lower
      } else if (lowAnswers.includes(higherLower)) {
        //unless they already said it was higher
        if(guess === min) {
          console.log(`But you said it was higher than ${min}`)
        } else {
          //it sets a new max
        max = computerGuess;
        //and makes a modified guess based on that output
        guess(min, max, count, secretNumber, computerGuess);
        }
      }
}

let yesAnswers = ['yes', 'y', 'it is'];
let noAnswers = ['no', 'n', 'nope', 'not'];
let highAnswers = ['higher', 'high', 'h'];
let lowAnswers = ['lower', 'low', 'l'];

start();

async function start() {
  let min = 1;
  let max = 100;
  let count = 0;
  //decides the first guess and logs it out to the console.
  let computerGuess = randomNum(min, max);
  console.log(`My first guess will be ${computerGuess}`);
  //declares rules of the game
  await ask("Let's play a game where you think of a number between 1 and 100 (inclusive)");
  await ask("And I (the computer) will guess what it is.");
  //asks what the secret number is
  let secretNumber = await ask("What is your secret number?\nI won't peek, I promise...\n");
  console.log(`(You entered: ${secretNumber}.)`);
  let input = await ask(`Is your number... ${computerGuess}?`);
    count = count + 1;
    console.log(count);
  sanitize(input);
  //if player says yes and it matches the original secret number value
  if(yesAnswers.includes(input) && (computerGuess === secretNumber)) {
    //increments count
    //and displays a winning message
    youWin(count, secretNumber);
  } //if player says no
  if (noAnswers.includes(input)) {
    highLow(min, max, count, secretNumber, computerGuess)
  }
}
