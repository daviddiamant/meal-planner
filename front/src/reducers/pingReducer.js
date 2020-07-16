import { GOT_PING_RES } from "../actions/actionTypes";

export function pingReducer(state = true, action) {
  switch (action.type) {
    case GOT_PING_RES:
      return action.res;

    default:
      return state;
  }
}
