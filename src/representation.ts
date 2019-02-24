import { Block, IState } from "./field";
import produce from "immer";
import { addToField } from "./control_block";

export type IStateRepresentation = string;

export const getStateRepresentation = (state: IState): IStateRepresentation => {
  const blockToRepr = (block: Block) => {
    switch (block) {
      case 0 : return " ";
      default: return block.toString();
    }
  };
  const updatedState = state.controlBlock ? produce(state, addToField) : state;
  return updatedState.blocks.slice().reverse().map(row => row.map(blockToRepr).join("")).join("\n");
};

