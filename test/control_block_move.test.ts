import { createInitialState } from "../src/field";
import { getStateRepresentation } from "../src/representation";
import _ = require("lodash");
import produce from "immer";
import { moveDown, moveLeft, moveRight } from "../src/control_block";

describe("Move control block right", () => {
  const height = 6;
  const width = 5;
  const state = createInitialState(height, width);

  it("can move right", () => {
    const newState = produce(state, moveRight);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
   2 \n\
   1 \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("can move 2x right", () => {
    const newState = _.range(2).reduce(produce(moveRight), state);
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

  it("can move max 2x right", () => {
    const newState = _.range(7).reduce(produce(moveRight), state);
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
});


describe("Move control block left", () => {
  const height = 6;
  const width = 5;
  const state = createInitialState(height, width);

  it("can move left", () => {
    const newState = produce(state, moveLeft);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
 2   \n\
 1   \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("can move 2x left", () => {
    const newState = _.range(2).reduce(produce(moveLeft), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
2    \n\
1    \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("can move max 2x right", () => {
    const newState = _.range(7).reduce(produce(moveLeft), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
2    \n\
1    \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });
});


describe("Move control block down", () => {
  const height = 6;
  const width = 5;
  const state = createInitialState(height, width);

  it("can move down", () => {
    const newState = produce(state, moveDown);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
     \n\
  2  \n\
  1  \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("can move 2x down", () => {
    const newState = _.range(2).reduce(produce(moveDown), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
     \n\
     \n\
  2  \n\
  1  \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it("can move max 4x down", () => {
    const newState = _.range(7).reduce(produce(moveDown), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
     \n\
     \n\
     \n\
     \n\
  2  \n\
  1  \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });
});