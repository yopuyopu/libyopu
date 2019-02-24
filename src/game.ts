import { terminal } from "terminal-kit";
import * as readline from "readline";
import produce from "immer";

import { createInitialState, IState, produceNextTick } from "./field";
import { getStateRepresentation } from "./representation";
import * as controlBlock from "./control_block";

const height = 20;
const width = 10;
const initialState = createInitialState(height, width);
initialState.fallSpeed = 2;
let currentState = initialState;

terminal.moveTo( 1 , 1 ) ;
terminal.clear();
terminal.magenta("YopuYopu demo");

setInterval(() => {
  currentState = produceNextTick(currentState);
  terminal.moveTo( 20 , 0 ) ;
  terminal.white("chain: " + currentState.removeChain.toString());
  terminal.moveTo( 30 , 0 ) ;
  terminal.white("tick: " + currentState.tick.toString());
  terminal.moveTo( 0 , 3 ) ;
  terminal.bgGreen().bold().white(getStateRepresentation(currentState));
  if (currentState.isDead) {
    terminal.moveTo( 0 , 2 ) ;
    terminal.resetDefaultBgColorRgb().red("Game Over :(");
  }
}, 20);

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode!(true);
process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else {
    const keyMap: {[key: string]: (state: IState) => any } = {
      "down": controlBlock.moveDown,
      "up": controlBlock.rotate,
      "left": controlBlock.moveLeft,
      "right": controlBlock.moveRight,
    };
    if (keyMap[key.name]) {
      currentState = produce(currentState, keyMap[key.name]);
    }
  }
});