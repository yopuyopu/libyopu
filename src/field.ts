import produce from "immer";
import * as controlBlock from "./control_block";

export type Block = number;

export interface IState {
  blocks: Block[][];
  tick: number;
  controlBlock: null | controlBlock.IControlBlockState;
  speed: number;
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
    speed: 10,
    isDead: false,
    coolDown: 9,
  };
};

export const getWidth = (state: IState) => state.blocks[0].length;
export const getHeight = (state: IState) => state.blocks.length - 2;

export const nextTick = (state: IState) => {
  state.tick += 1;
  if (state.coolDown > 0) {
    state.coolDown--;
    return;
  }
  if (state.controlBlock) {
    controlBlock.drop(state);
    state.coolDown = state.speed - 1;
  } else {
    if (!controlBlock.canBeCreated(state)) {
      state.isDead = true;
    } else {
      controlBlock.createControlBlock(state);
    }
  }
};

export const produceNextTick = (state: IState) => produce(state, nextTick);






