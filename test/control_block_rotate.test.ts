import { createInitialState} from "../src/field";
import { getStateRepresentation } from "../src/representation";
import produce from "immer";
import { moveRight, rotateBlock } from '../src/control_block';

describe("Rotate control block", () => {
  const height = 6;
  const width = 5;
  const state = createInitialState(height, width);

  it("can rotate right", () => {
    const newState = produce(state, rotateBlock);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
     \n\
  12 \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("can't rotate at right wall", () => {
    const moves = [moveRight, moveRight, rotateBlock];
    const newState = moves.reduce((acc, move, _) => produce(acc, move), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
    2\n\
    1\n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("flips after double rotate", () => {
    const moves = [rotateBlock, rotateBlock];
    const newState = moves.reduce((acc, move, _) => produce(acc, move), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
  1  \n\
  2  \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

});