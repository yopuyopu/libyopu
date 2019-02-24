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
    positionX: getStartPositionX(state),
    positionY: getHeight(state),
    firstBlock: 1,
    secondBlock: 2
  };
};
export const getStartPositionX = (state: IState) => Math.floor(getWidth(state) / 2);

export const isDownEmpty = (state: IState, x: number, y: number) => {
  if (y === 0) return false;
  return state.blocks[y - 1][x] === 0;
};
export const isLeftEmpty = (state: IState, x: number, y: number) => {
  if (x === 0) return false;
  return state.blocks[y][x - 1] === 0;
};

export const isRightEmpty = (state: IState, x: number, y: number) => {
  if (x === getWidth(state)) return false;
  return state.blocks[y][x + 1] === 0;
};

export const shouldAttach = (state: IState): boolean => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return false;
  if (controlBlock.positionY === 0) return true;
  if (!isDownEmpty(state, controlBlock.positionX, controlBlock.positionY)) return true;
  if (controlBlock.orientation === Orientation.HORIZONTAL) {
    if (!isDownEmpty(state, controlBlock.positionX + 1, controlBlock.positionY)) return true;
  }
  return false;
};

export const drop = (state: IState) => {
  if (!state.controlBlock) return;
  if (shouldAttach(state)) {
    addToField(state);
    state.controlBlock = null;
  } else {
    moveDown(state);
  }
};
export const moveRight = (state: IState) => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return;
  if (isRightEmpty(
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
  if (isLeftEmpty(
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
  if (!shouldAttach(state)) {
    controlBlock.positionY--;
  }
};
export const rotate = (state: IState) => {
  const controlBlock = state.controlBlock;
  if (!controlBlock) return;

  if (controlBlock.orientation === Orientation.VERTICAL) {
    if (!isRightEmpty(state, controlBlock.positionX, controlBlock.positionY)) return;
  }

  controlBlock.orientation = controlBlock.orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
  if (controlBlock.orientation === Orientation.VERTICAL) {
    [controlBlock.firstBlock, controlBlock.secondBlock] = [controlBlock.secondBlock, controlBlock.firstBlock];
  }
};

export const canBeCreated = (state: IState) => state.blocks[getHeight(state)][getStartPositionX(state)] === 0;
export const addToField = (state: IState): void => {
  if (!state.controlBlock) return;
  const block1X = state.controlBlock.positionX;
  const block1Y = state.controlBlock.positionY;
  const block2X = state.controlBlock.orientation === Orientation.VERTICAL ? state.controlBlock.positionX : state.controlBlock.positionX + 1;
  const block2Y = state.controlBlock.orientation === Orientation.VERTICAL ? state.controlBlock.positionY + 1 : state.controlBlock.positionY;
  state.blocks[block1Y][block1X] = state.controlBlock.firstBlock;
  state.blocks[block2Y][block2X] = state.controlBlock.secondBlock;
};