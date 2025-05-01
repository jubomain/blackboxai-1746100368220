const TexasHoldemGame = require('./texas_holdem_game_engine');
const AIBot = require('./ai_bot');

function testGameInitialization() {
  const game = new TexasHoldemGame(['Alice', 'Bob', 'Charlie']);
  console.assert(game.players.length === 3, 'Should have 3 players');
  console.assert(game.pot === 0, 'Pot should start at 0');
  console.log('testGameInitialization passed');
}

function testDeckInitialization() {
  const game = new TexasHoldemGame(['Alice', 'Bob']);
  game.initDeck();
  console.assert(game.deck.length === 52, 'Deck should have 52 cards');
  console.log('testDeckInitialization passed');
}

function testDealHands() {
  const game = new TexasHoldemGame(['Alice', 'Bob']);
  game.initDeck();
  game.dealHands();
  for (const player of game.players) {
    console.assert(player.hand.length === 2, 'Each player should have 2 cards');
  }
  console.log('testDealHands passed');
}

function testPostBlinds() {
  const game = new TexasHoldemGame(['Alice', 'Bob', 'Charlie']);
  game.initDeck();
  game.dealHands();
  game.moveDealer();
  game.postBlinds();
  const smallBlindPlayer = game.players[(game.dealerIndex + 1) % game.players.length];
  const bigBlindPlayer = game.players[(game.dealerIndex + 2) % game.players.length];
  console.assert(smallBlindPlayer.currentBet === game.smallBlind, 'Small blind should be posted');
  console.assert(bigBlindPlayer.currentBet === game.bigBlind, 'Big blind should be posted');
  console.log('testPostBlinds passed');
}

function testPlayerAction() {
  const game = new TexasHoldemGame(['Alice', 'Bob']);
  game.initDeck();
  game.dealHands();
  const player = game.players[0];
  const initialChips = player.chips;
  game.playerAction(player.id, 'bet', 50);
  console.assert(player.chips === initialChips - 50, 'Player chips should decrease by bet amount');
  console.assert(game.pot === 50, 'Pot should increase by bet amount');
  game.playerAction(player.id, 'fold');
  console.assert(player.folded === true, 'Player should be folded');
  console.log('testPlayerAction passed');
}

function testAIBotDecision() {
  const game = new TexasHoldemGame(['Bot']);
  game.initDeck();
  game.dealHands();
  const botPlayer = game.players[0];
  botPlayer.isBot = true;
  const bot = new AIBot(botPlayer, game);
  const decision = bot.decideAction();
  console.assert(['check', 'bet', 'fold'].includes(decision.action || decision), 'Bot decision should be valid');
  console.log('testAIBotDecision passed');
}

function runAllTests() {
  testGameInitialization();
  testDeckInitialization();
  testDealHands();
  testPostBlinds();
  testPlayerAction();
  testAIBotDecision();
  console.log('All tests passed!');
}

runAllTests();
