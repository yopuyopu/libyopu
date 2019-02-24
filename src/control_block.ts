import { Block, getHeight, getWidth, IState } from "./field";


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

export const createControlBlock = (state: IState) => {
  state.controlBlock = {
    orientation: Orientation.VERTICAL,
    positionX: getControlBlockStartX(state),
    positionY: getHeight(state),
    firstBlock: 1,
    secondBlock: 2
  };
};
export const getControlBlockStartX = (state: IState) => Math.floor(getWidth(state) / 2);
export const canBlockMoveDown = (state: IState, x: number, y: number) => {
  if (y === 0) return false;
  return state.blocks[y - 1][x] === 0;
};
export const canBlockMoveLeft = (state: IState, x: number, y: number) => {
  if (x === 0) return false;
  return state.blocks[y][x - 1] === 0;
};

export const canBlockMoveRight = (state: IState, x: number, y: number) => {
  if (x === getWidth(state)) return false;
  return state.blocks[y][x + 1] === 0;
};

export const shouldControlBlockAttach = (state: IState): boolean => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return false;
  if (controlBlock.positionY === 0) return true;
  if (!canBlockMoveDown(state, controlBlock.positionX, controlBlock.positionY)) return true;
  if (controlBlock.orientation === Orientation.HORIZONTAL) {
    if (!canBlockMoveDown(state, controlBlock.positionX + 1, controlBlock.positionY)) return true;
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
export const moveRight = (state: IState) => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return;
  if (canBlockMoveRight(
    state,
    controlBlock.positionX + (controlBlock.orientation === Orientation.HORIZONTAL ? 1 : 0),
    controlBlock.positionY
  )) {
    controlBlock.positionX++;
  }
};
export const moveLeft = (state: IState) => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return;
  if (canBlockMoveLeft(
    state,
    controlBlock.positionX,
    controlBlock.positionY
  )) {
    controlBlock.positionX--;
  }
};
export const moveDown = (state: IState) => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return;
  if (!shouldControlBlockAttach(state)) {
    controlBlock.positionY--;
  }
};
export const rotateBlock = (state: IState) => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return;

  if (controlBlock.orientation === Orientation.VERTICAL) {
    if (!canBlockMoveRight(state, controlBlock.positionX, controlBlock.positionY)) return;
  }

  controlBlock.orientation = controlBlock.orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
  if (controlBlock.orientation === Orientation.VERTICAL) {
    [controlBlock.firstBlock, controlBlock.secondBlock] = [controlBlock.secondBlock, controlBlock.firstBlock];
  }
};
export const shouldControlBlockDrop = (state: IState) => state.controlBlock && state.tick % state.speed === 0;
export const canCreateControlBlock = (state: IState) => state.blocks[getHeight(state)][getControlBlockStartX(state)] > 0;
export const addControlBlockToBlocks = (state: IState): void => {
  if (!state.controlBlock) return;
  const block1X = state.controlBlock.positionX;
  const block1Y = state.controlBlock.positionY;
  const block2X = state.controlBlock.orientation === Orientation.VERTICAL ? state.controlBlock.positionX : state.controlBlock.positionX + 1;
  const block2Y = state.controlBlock.orientation === Orientation.VERTICAL ? state.controlBlock.positionY + 1 : state.controlBlock.positionY;
  state.blocks[block1Y][block1X] = state.controlBlock.firstBlock;
  state.blocks[block2Y][block2X] = state.controlBlock.secondBlock;
};