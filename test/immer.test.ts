import { createInitialState, produceNextTick } from "../src/field";
import produce from "immer";

describe("Test immer deep copy", () => {
  const initialState = createInitialState(2, 2);
  const nextState = produce(initialState, draftState => {
    draftState.blocks[0][0] = 1;
  });
  it("Updates nextState", () => {
    expect(nextState.blocks[0][0]).toBe(1);
  });
  it("Doesn't change original state", () => {
    expect(initialState.blocks[0][0]).toBe(0);
  });
});
