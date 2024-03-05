import { combineReducers } from '@reduxjs/toolkit';
import actionsTypes from './actionTypes.js'

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

const counterReducer = (state = {value: 0}, action) => {
  switch(action.type) {
    case "inc":
      return {
        ...state,
        value: state.value + 1,
      };
    
    case "dec":
      return {
        ...state,
        value: state.value - 1,
      };
    
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  items: itemReducer,
});

export default rootReducer;
