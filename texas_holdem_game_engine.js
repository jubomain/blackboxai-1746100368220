/**
 * Texas Hold'em Game Engine
 * Features:
 * - Game state management (players, cards, blinds, pot)
 * - Hand evaluation and ranking logic
 * - Game mechanics including small blind, big blind, betting rounds, split pot logic
 * - Table clearing after each hand
 */

class TexasHoldemGame {
  constructor(players, smallBlind = 10, bigBlind = 20) {
    this.players = players.map((p, i) => ({
      id: i + 1,
      name: p,
      chips: 1000,
      hand: [],
      folded: false,
      allIn: false,
      currentBet: 0,
      isBot: false,
    }));
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.deck = [];
    this.communityCards = [];
    this.pot = 0;
    this.currentPlayerIndex = 0;
    this.bettingRound = 0; // 0: pre-flop, 1: flop, 2: turn, 3: river
    this.bets = [];
    this.dealerIndex = 0;
  }

  // Initialize and shuffle deck
  initDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = [
      '2', '3', '4', '5', '6', '7', '8', '9', '10',
      'J', 'Q', 'K', 'A',
    ];
    this.deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        this.deck.push({ rank, suit });
      }
    }
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  // Deal two cards to each player
  dealHands() {
    for (const player of this.players) {
      player.hand = [this.deck.pop(), this.deck.pop()];
      player.folded = false;
      player.allIn = false;
      player.currentBet = 0;
    }
  }

  // Move dealer button to next player
  moveDealer() {
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
  }

  // Post blinds
  postBlinds() {
    const smallBlindIndex = (this.dealerIndex + 1) % this.players.length;
    const bigBlindIndex = (this.dealerIndex + 2) % this.players.length;

    this.players[smallBlindIndex].chips -= this.smallBlind;
    this.players[smallBlindIndex].currentBet = this.smallBlind;
    this.players[bigBlindIndex].chips -= this.bigBlind;
    this.players[bigBlindIndex].currentBet = this.bigBlind;

    this.pot = this.smallBlind + this.bigBlind;
    this.currentPlayerIndex = (bigBlindIndex + 1) % this.players.length;
  }

  // Clear table for next hand
  clearTable() {
    this.communityCards = [];
    this.pot = 0;
    this.bettingRound = 0;
    this.bets = [];
    for (const player of this.players) {
      player.hand = [];
      player.folded = false;
      player.allIn = false;
      player.currentBet = 0;
    }
  }

  // Deal community cards based on betting round
  dealCommunityCards() {
    if (this.bettingRound === 1) {
      // Flop - 3 cards
      this.communityCards.push(this.deck.pop());
      this.communityCards.push(this.deck.pop());
      this.communityCards.push(this.deck.pop());
    } else if (this.bettingRound === 2) {
      // Turn - 1 card
      this.communityCards.push(this.deck.pop());
    } else if (this.bettingRound === 3) {
      // River - 1 card
      this.communityCards.push(this.deck.pop());
    }
  }

  // Evaluate hands and determine winner(s)
  evaluateHands() {
    // Placeholder: Implement hand evaluation logic here
    // For now, return all players who have not folded
    return this.players.filter(p => !p.folded);
  }

  // Split pot logic for multiple winners
  splitPot(winners) {
    const splitAmount = Math.floor(this.pot / winners.length);
    for (const winner of winners) {
      winner.chips += splitAmount;
    }
    this.pot = 0;
  }

  // Player action: check, bet, fold
  playerAction(playerId, action, amount = 0) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.folded) return false;

    switch (action) {
      case 'fold':
        player.folded = true;
        break;
      case 'check':
        // No chips bet, just pass
        break;
      case 'bet':
        if (amount > player.chips) {
          amount = player.chips;
          player.allIn = true;
        }
        player.chips -= amount;
        player.currentBet += amount;
        this.pot += amount;
        break;
      default:
        return false;
    }
    return true;
  }

  // Run a full hand (simplified)
  playHand() {
    this.clearTable();
    this.initDeck();
    this.moveDealer();
    this.dealHands();
    this.postBlinds();

    // Pre-flop betting round
    this.bettingRound = 0;
    // Betting logic here (not implemented)

    // Flop
    this.bettingRound = 1;
    this.dealCommunityCards();
    // Betting logic here (not implemented)

    // Turn
    this.bettingRound = 2;
    this.dealCommunityCards();
    // Betting logic here (not implemented)

    // River
    this.bettingRound = 3;
    this.dealCommunityCards();
    // Betting logic here (not implemented)

    // Showdown
    const winners = this.evaluateHands();
    this.splitPot(winners);
  }
}

module.exports = TexasHoldemGame;
