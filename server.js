const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");


// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '4a5045a498e346b0a4264b766b241639',
  captureUncaught: true,
  captureUnhandledRejections: true,
})         
// record a generic message and send it to Rollbar
rollbar.log('Hello world!');
 
const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static('./public'));

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
    rollbar.info('Call to /api/robots');
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    rollbar.error('Error in call to /api/robots');
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);    
    res.status(200).send(shuffled);
    rollbar.info('Call to /api/robots/shuffled');
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    rollbar.error('Error in call to /api/robots/shuffled');
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
    rollbar.info('Call to /api/duel');
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
    rollbar.error('Error in call to /api/duel');
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
    rollbar.info('Call to /api/player');
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
    rollbar.error('Error in call to /api/player');
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
