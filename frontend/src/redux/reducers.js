import { combineReducers } from "@reduxjs/toolkit";
import actionsTypes from "./actionTypes.js";

const initialState = [];

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsTypes.ADDED_ITEM:
      return [
        ...state,
        {
          description: action.payload.description,
          id: action.payload.id,
        },
      ];

    case actionsTypes.REMOVED_ITEM:
      return state.filter((item) => item.id !== action.payload.id);

    default:
      return state;
  }
};

const authReducer = (state = { isAdmin: null }, action) => {
  // switch (action.type) {
  //   case true:
  //     return { isAdmin: true };

  //   case false:
  //     return { isAdmin: false };

  //   default:
  //     return state;
  // }
  const actions = {
    isAdmin: { isAdmin: true },
    notAdmin: { isAdmin: false },
    default: state,
  };

  return actions[action.type] ?? actions["default"];
};

const rootReducer = combineReducers({
  items: itemReducer,
  auth: authReducer,
});

export default rootReducer;
