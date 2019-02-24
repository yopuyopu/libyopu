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
    coolDown: 9,
  };
};

export const getWidth = (state: IState) => state.blocks[0].length;
export const getHeight = (state: IState) => state.blocks.length - 2;
export const forEachBlock = (state: IState, cb: (y: number, x: number) => any) => {
  state.blocks.forEach((row, rowIndex) => row.forEach((block, colIndex) => cb(rowIndex, colIndex)));
};

export const fallBlocks = (state: IState) => {
  let hasDropped = false;
  forEachBlock(state, (y, x) => {
    if (state.blocks[y][x] !== 0 && controlBlock.isDownEmpty(state, x, y)) {
      state.blocks[y - 1][x] = state.blocks[y][x];
      state.blocks[y][x] = 0;
      hasDropped = true;
    }
  });
  return hasDropped;
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
  } else {
    if (fallBlocks(state)) {
      state.coolDown = state.fallSpeed - 1;
    } else {
      if (!controlBlock.canBeCreated(state)) {
        state.isDead = true;
      } else {
        controlBlock.createControlBlock(state);
        state.coolDown = state.controlBlockSpeed - 1;
      }
    }
  }
};

export const produceNextTick = (state: IState) => produce(state, nextTick);






