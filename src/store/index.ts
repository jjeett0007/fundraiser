import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userTokenReducer from "./slice/userTokenSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userToken"],
};

const rootReducer = combineReducers({
  userToken: userTokenReducer,
});

const rootReducerWithReset = (state: any, action: any) => {
  if (action.type === "global/clearState") {
    storage.removeItem("persist:root");
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducerWithReset);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);

export const clearState = () => async (dispatch: AppDispatch) => {
  await persistor.purge();
  dispatch({ type: "global/clearState" });
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
