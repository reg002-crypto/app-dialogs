import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createSelectorHook, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';

import DialogsReducer from './modules/Dialogs';

export const reducer = {
  Dialogs: DialogsReducer,
};

const rootReducer = combineReducers({ ...reducer });

export type GlobalState = ReturnType<typeof rootReducer>;

// @ts-ignore
export const useTypedSelector = createSelectorHook<GlobalState>();
export const useTypedDispatch = useDispatch;

export const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

if (process.env.NODE_ENV !== 'production') {
  //@ts-ignore
  window.store = store;
}
