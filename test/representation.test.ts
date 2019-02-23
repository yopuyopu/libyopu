import { createInitialState, produceNextTick } from '../src/field';
import { getStateRepresentation } from '../src/representation';
import _ = require('lodash');

describe("Text representation", () => {
  const height = 6;
  const width = 5;
  it.skip("transform back", () => {
    const state = createInitialState(height, width);
    const stateReprepresentation = getStateRepresentation(state);
    expect(getStateRepresentation(getStateFromRepresentation(stateReprepresentation))).toEqual(stateReprepresentation);
  });
  it("inital state looks ok", () => {
    const state = createInitialState(height, width);
    const stateReprepresentation = getStateRepresentation(state);
    const expectedRepresentation = "\
  2  \n\
  1  \n\
     \n\
     \n\
     \n\
     \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });
});

describe("Falling block", () => {
  const height = 6;
  const width = 5;
  const state = createInitialState(height, width);
  it('stays for 9 ticks', () => {
    const newState = _.range(9).reduce(acc => produceNextTick(acc), state);
    expect(newState.tick).toBe(9);
    expect(newState.controlBlock).toBe(state.controlBlock);
  });
  it('falls after 10 ticks', () => {
    const newState = _.range(10).reduce(acc => produceNextTick(acc), state);
    expect(newState.controlBlock).not.toBe(state.controlBlock);
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
  it('is on floor after 40 ticks', () => {
    const newState = _.range(40).reduce(acc => produceNextTick(acc), state);
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
  it('is on floor after 50 ticks', () => {
    const newState = _.range(50).reduce(acc => produceNextTick(acc), state);
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
  it('is creates new falling block after 60 ticks', () => {
    const newState = _.range(60).reduce(acc => produceNextTick(acc), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
  2  \n\
  1  \n\
     \n\
     \n\
  2  \n\
  1  \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it('is drops on other blocks after 90 ticks', () => {
    const newState = _.range(90).reduce(acc => produceNextTick(acc), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
     \n\
     \n\
  2  \n\
  1  \n\
  2  \n\
  1  \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it('is creates more blocks after 100 ticks', () => {
    const newState = _.range(100).reduce(acc => produceNextTick(acc), state);
    const stateReprepresentation = getStateRepresentation(newState);
    const expectedRepresentation = "\
  2  \n\
  1  \n\
  2  \n\
  1  \n\
  2  \n\
  1  \
";
    expect(stateReprepresentation).toEqual(expectedRepresentation);
  });

  it('is is dead after 120 ticks', () => {
    const newState = _.range(120).reduce(acc => produceNextTick(acc), state);
    expect(newState.isDead).toBeTruthy();
  });
});