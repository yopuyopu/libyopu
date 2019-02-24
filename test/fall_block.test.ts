import { createInitialState, produceNextTick } from "../src/field";
import { getStateRepresentation } from "../src/representation";
import * as _ from "lodash";

describe("Falling block", () => {
  const height = 6;
  const width = 5;
  const state = createInitialState(height, width);
  state.controlBlock = null;
  state.blocks[0][2] = 1;
  state.blocks[1][2] = 2;
  state.blocks[2][2] = 2;
  state.blocks[2][3] = 1;
  state.coolDown = 0;
  it("initial state has expected representation", () => {
    const stateReprepresentation = getStateRepresentation(state);
    const expectedRepresentation = "\
     \n\
     \n\
     \n\
  21 \n\
  2  \n\
  1  \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("falls after fallSpeed ticks", () => {
    const newState = _.range(state.fallSpeed).reduce(produceNextTick, state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
     \n\
     \n\
     \n\
  2  \n\
  21 \n\
  1  \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });
});

