/**
 * Simple AI Bot for Texas Hold'em
 * Can make decisions: check, bet, fold
 * Uses basic heuristics based on hand strength and pot size
 */

class AIBot {
  constructor(player, game) {
    this.player = player;
    this.game = game;
  }

  // Evaluate hand strength (placeholder simple heuristic)
  evaluateHand() {
    // For simplicity, count number of high cards (J, Q, K, A)
    const highRanks = ['J', 'Q', 'K', 'A'];
    let score = 0;
    for (const card of this.player.hand) {
      if (highRanks.includes(card.rank)) {
        score += 1;
      }
    }
    return score;
  }

  // Decide action: check, bet, fold
  decideAction() {
    if (this.player.folded || this.player.allIn) {
      return 'fold';
    }
    const handStrength = this.evaluateHand();
    const minBet = this.game.bigBlind;
    const canCheck = this.player.currentBet === this.game.currentBet;

    if (handStrength >= 2) {
      // Strong hand: bet or raise
      if (this.player.chips > minBet) {
        return { action: 'bet', amount: minBet };
      } else {
        return { action: 'bet', amount: this.player.chips };
      }
    } else if (handStrength === 1) {
      // Medium hand: check if possible, else fold
      if (canCheck) {
        return { action: 'check' };
      } else {
        return { action: 'fold' };
      }
    } else {
      // Weak hand: fold
      return { action: 'fold' };
    }
  }
}

module.exports = AIBot;
