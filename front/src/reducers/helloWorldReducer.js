import { CHANGE_HELLO_WORLD } from "../actions/actionTypes";

export function helloWorldReducer(state = "Hello World!", action) {
  switch (action.type) {
    case CHANGE_HELLO_WORLD:
      return action.newMessage;
    default:
      return state;
  }
}
