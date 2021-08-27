export type AIGridPoints = {
  emptyBox: number;
  preferEmptyBoxes: number;
  advancedAttack: number;

  adjacted: {
    playerMoreThanOponent: number;
    playerEqualToOponent: number;
    playerLessThanOponent: number;

    playerMoreThanPlayer: number;
    playerEqualToPlayer: number;
    playerLessThanPlayer: number;

    sixToSix: number;
    toBorder: number;
  };

  diagonall: {
    playerMoreThanOponent: number;
    playerEqualToOponent: number;
    playerLessThanOponent: number;

    playerMoreThanPlayer: number;
    playerEqualToPlayer: number;
    playerLessThanPlayer: number;

    toBorder: number;
  };
};

export const hardAIGridPoints: AIGridPoints = {
  emptyBox: 50,
  preferEmptyBoxes: 15,
  advancedAttack: 20,

  adjacted: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 10,
    playerLessThanOponent: -10,

    playerMoreThanPlayer: -5,
    playerEqualToPlayer: -4,
    playerLessThanPlayer: -15,

    sixToSix: 50,
    toBorder: 0,
  },

  diagonall: {
    playerMoreThanOponent: 1,
    playerEqualToOponent: 2,
    playerLessThanOponent: 7,

    playerMoreThanPlayer: -5,
    playerEqualToPlayer: -4,
    playerLessThanPlayer: 0,

    toBorder: 0,
  },
};

export const mediumAIGridPoints: AIGridPoints = {
  emptyBox: 50,
  preferEmptyBoxes: 15,
  advancedAttack: 0,

  adjacted: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 2,
    playerLessThanOponent: -2,

    playerMoreThanPlayer: -1,
    playerEqualToPlayer: -1,
    playerLessThanPlayer: -2,

    sixToSix: 2,
    toBorder: 0,
  },

  diagonall: {
    playerMoreThanOponent: 1,
    playerEqualToOponent: 1,
    playerLessThanOponent: 2,

    playerMoreThanPlayer: -1,
    playerEqualToPlayer: -1,
    playerLessThanPlayer: 0,

    toBorder: 0,
  },
};

export const easyAIGridPoints: AIGridPoints = {
  emptyBox: 50,
  preferEmptyBoxes: 15,
  advancedAttack: 0,

  adjacted: {
    playerMoreThanOponent: 0,
    playerEqualToOponent: 0,
    playerLessThanOponent: -2,

    playerMoreThanPlayer: -2,
    playerEqualToPlayer: 0,
    playerLessThanPlayer: -2,

    sixToSix: 2,
    toBorder: 0,
  },

  diagonall: {
    playerMoreThanOponent: 5,
    playerEqualToOponent: 0,
    playerLessThanOponent: 5,

    playerMoreThanPlayer: -2,
    playerEqualToPlayer:0,
    playerLessThanPlayer: 0,

    toBorder: 0,
  },
};
