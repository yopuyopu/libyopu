import produce from "immer";

export type Block = number;

export enum Orientation {
  HORIZONTAL,
  VERTICAL,
}

export interface IControlBlockState {
  orientation: Orientation;
  firstBlock: Block;
  secondBlock: Block;
  positionX: number;
  positionY: number;
}

export interface IState {
  blocks: Block[][];
  tick: number;
  controlBlock: null | IControlBlockState;
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
      orientation: Orientation.VERTICAL,
      positionX: Math.floor(width / 2),
      positionY: height - 2,
      firstBlock: 1,
      secondBlock: 2,
    },
    speed: 10,
    isDead: false,
  };
};

export const createControlBlock = (state: IState) => {
  state.controlBlock = {
    orientation: Orientation.VERTICAL,
    positionX: getControlBlockStartX(state),
    positionY: getHeight(state),
    firstBlock: 1,
    secondBlock: 2,
  };
};

export const getWidth = (state: IState) => state.blocks[0].length;
export const getControlBlockStartX = (state: IState) => Math.floor(getWidth(state) / 2);
export const getHeight = (state: IState) => state.blocks.length - 2;

export const isBlockOnTopOfOtherBlock = (state: IState, x: number, y: number) => {
  if (y === 0) return true;
  return state.blocks[y - 1][x] > 0;
};

export const shouldControlBlockAttach = (state: IState): boolean => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return false;
  if (controlBlock.positionY === 0) return true;
  if (isBlockOnTopOfOtherBlock(state, controlBlock.positionX, controlBlock.positionY)) return true;
  if (controlBlock.orientation === Orientation.HORIZONTAL) {
    if (isBlockOnTopOfOtherBlock(state, controlBlock.positionX + 1, controlBlock.positionY)) return true;
  }
  return false;
};

export const dropControlBlock = (state: IState) => {
  if (!state.controlBlock) return;
  if (shouldControlBlockAttach(state)) {
    addControlBlockToBlocks(state);
    state.controlBlock = null;
  } else {
    state.controlBlock.positionY -= 1;
  }
};

export const shouldControlBlockDrop = (state: IState) => state.controlBlock && state.tick % state.speed === 0;

export const canCreateControlBlock = (state: IState) => state.blocks[getHeight(state)][getControlBlockStartX(state)] > 0;

export const nextTick = (state: IState) => {
  state.tick += 1;
  if (shouldControlBlockDrop(state)) {
    dropControlBlock(state);
  } else {
    if (!state.controlBlock && state.tick % state.speed === 0) {
      if (canCreateControlBlock(state)) {
        state.isDead = true;
      } else {
        createControlBlock(state);
      }
    }
  }
};

export const produceNextTick = (state: IState) => produce(state, nextTick);

export const moveRight = (currentState: IState) => produce(currentState, draftState => {
  draftState.tick += 1;
});

export const addControlBlockToBlocks = (state: IState): void => {
  if (!state.controlBlock) return;
  const block1X = state.controlBlock.positionX;
  const block1Y = state.controlBlock.positionY;
  const block2X = state.controlBlock.orientation === Orientation.VERTICAL ? state.controlBlock.positionX : state.controlBlock.positionX + 1;
  const block2Y = state.controlBlock.orientation === Orientation.VERTICAL ? state.controlBlock.positionY + 1 : state.controlBlock.positionX;
  state.blocks[block1Y][block1X] = state.controlBlock.firstBlock;
  state.blocks[block2Y][block2X] = state.controlBlock.secondBlock;
};




