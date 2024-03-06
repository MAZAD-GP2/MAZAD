import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
    reducer: rootReducer,
    // other configurations if needed
});

export default store;

