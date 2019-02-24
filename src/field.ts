import produce from "immer";
import * as controlBlock from "./control_block";

export type Block = number;

export interface IState {
  blocks: Block[][];
  tick: number;
  controlBlock: null | controlBlock.IControlBlockState;
  speed: number;
  isDead: boolean;
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
  };
};

export const getWidth = (state: IState) => state.blocks[0].length;
export const getHeight = (state: IState) => state.blocks.length - 2;

export const nextTick = (state: IState) => {
  state.tick += 1;
  if (controlBlock.shouldDrop(state)) {
    controlBlock.drop(state);
  } else {
    if (!state.controlBlock && state.tick % state.speed === 0) {
      if (controlBlock.canBeCreated(state)) {
        state.isDead = true;
      } else {
        controlBlock.createControlBlock(state);
      }
    }
  }
};

export const produceNextTick = (state: IState) => produce(state, nextTick);






