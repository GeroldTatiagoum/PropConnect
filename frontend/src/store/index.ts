import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth.slice';
import userReducer from './user.slice';
import propertiesReducer from './properties.slice';
import marketplaceReducer from './marketplace.slice';
import uiReducer from './ui.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    properties: propertiesReducer,
    marketplace: marketplaceReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
