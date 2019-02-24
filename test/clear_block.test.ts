import { createInitialState, produceNextTick } from "../src/field";
import { getStateRepresentation } from "../src/representation";
import _ from "lodash";


describe("Clearing blocks in l-shape", () => {
    const height = 6;
    const width = 5;
    const state = createInitialState(height, width);
    state.controlBlock = null;
    state.blocks[0][0] = 2;
    state.blocks[1][0] = 2;
    state.blocks[2][0] = 1;
    state.blocks[0][1] = 1;
    state.blocks[1][1] = 1;
    state.blocks[2][1] = 1;
    state.coolDown = 0;
    const newState = produceNextTick(state);
    it("initial state has expected representation", () => {
      const stateReprepresentation = getStateRepresentation(newState);
      const expectedRepresentation = "\
     \n\
     \n\
     \n\
     \n\
2    \n\
2    \
";
      expect(stateReprepresentation).toEqual(expectedRepresentation);
    });
  });
  
  