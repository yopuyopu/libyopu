import produce from "immer";
import * as controlBlock from "./control_block";

export type Block = number;

export interface IState {
  blocks: Block[][];
  tick: number;
  controlBlock: null | controlBlock.IControlBlockState;
  controlBlockSpeed: number;
  fallSpeed: number;
  isDead: boolean;
  coolDown: number;
  removeChain: number;
}

export const createInitialState = (height: number, width: number): IState => {
  const blockArray: Block[][] = [];
  for (let i = 0; i < height; i++) {
    blockArray[i] = Array(width).fill(0);
  }
  return {
    blocks: blockArray,
    tick: 0,
    controlBlock: {
      orientation: controlBlock.Orientation.VERTICAL,
      positionX: Math.floor(width / 2),
      positionY: height - 2,
      firstBlock: 1,
      secondBlock: 2,
    },
    controlBlockSpeed: 10,
    fallSpeed: 5,
    isDead: false,
    removeChain : 0,
    coolDown: 9,
  };
};

export const getWidth = (state: IState) => state.blocks[0].length;
export const getHeight = (state: IState) => state.blocks.length - 2;
export const forEachBlock = (state: IState, cb: (y: number, x: number) => any) => {
  state.blocks.forEach((row, rowIndex) => row.forEach((block, colIndex) => cb(rowIndex, colIndex)));
};

export const fallBlocks = (state: IState) => {
  forEachBlock(state, (y, x) => {
    if (state.blocks[y][x] !== 0 && controlBlock.isDownEmpty(state, x, y)) {
      state.blocks[y - 1][x] = state.blocks[y][x];
      state.blocks[y][x] = 0;
    }
  });
};

export const addToChain = (state: IState, y: number, x: number, chain: [number, number][]) => {
  chain.push([y, x]);
  const sameColoredNeighbours: typeof chain = [];
  if (state.blocks[y + 1] && state.blocks[y + 1][x] === state.blocks[y][x]) {
    // on top
    sameColoredNeighbours.push([y + 1, x]);
  }
  if (y > 0 && state.blocks[y - 1][x] === state.blocks[y][x]) {
    // on bottom
    sameColoredNeighbours.push([y - 1, x]);
  }
  if (x < (getWidth(state) - 1) && state.blocks[y][x + 1] === state.blocks[y][x]) {
    // on right
    sameColoredNeighbours.push([y, x + 1]);
  }
  if (x > 0 && state.blocks[y][x - 1] === state.blocks[y][x]) {
    // on left
    sameColoredNeighbours.push([y, x - 1]);
  }

  sameColoredNeighbours.forEach(pos => {
    if (!chain.map(p => p.toString()).includes(pos.toString())) {
      addToChain(state, pos[0], pos[1], chain);
    }
  });
};

export const removeGroups = (state: IState) => {
  let groupsRemoved = 0;
  let blocksRemoved = 0;
  forEachBlock(state, (y, x) => {
    if (state.blocks[y][x] > 0) {
      const chain: [number, number][] = [];
      addToChain(state, y, x, chain);
      if (chain.length > 3) {
        chain.forEach(pos => {
          state.blocks[pos[0]][pos[1]] = 0;
          groupsRemoved += 1;
          blocksRemoved += chain.length;
        });
      }
    }
  });
  return [groupsRemoved, blocksRemoved];
};

export const nextTick = (state: IState) => {
  state.tick += 1;
  if (state.coolDown > 0) {
    state.coolDown--;
    return;
  }
  if (state.controlBlock) {
    controlBlock.drop(state);
    state.coolDown = state.controlBlockSpeed - 1;
    return;
  }

  // if there are blocks that should fall
  if (state !== produce(state, fallBlocks)) {
    // let the blocks fall
    fallBlocks(state);
    // if done falling, long cooldown. Else short cooldown
    state.coolDown = ((state === produce(state, fallBlocks)) ? state.controlBlockSpeed : state.fallSpeed) - 1;
    return;
  }

  const [groupsRemoved, blocksRemoved] = removeGroups(state);
  if (groupsRemoved > 0) {
    state.coolDown = state.controlBlockSpeed - 1;
    state.removeChain += 1;
    return;
  } else {
    // We're done with this fall + block remove cycle.
    state.removeChain = 0;
  }

  if (!controlBlock.canBeCreated(state)) {
    state.isDead = true;
  } else {
    controlBlock.createControlBlock(state);
    state.coolDown = state.controlBlockSpeed - 1;
  }
};

export const produceNextTick = (state: IState) => produce(state, nextTick);






