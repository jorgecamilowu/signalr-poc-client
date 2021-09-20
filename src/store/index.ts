import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { config, signalRHub, signalRMiddleware } from "./middlewares";
import rootReducer from "./rootReducer";

const signalMiddleware = signalRMiddleware(signalRHub, config);

/**
 * Additional middleware should be defined in this array. Note that
 * the call to getDefaultMiddleware should be invoked last, otherwise the dispatch
 * will not be typed correctly.
 * Not sure why this is happening, but it is an issue when defining additional
 * middleware.
 */

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: signalRHub,
      },
    }).concat(signalMiddleware),
  devTools: process.env.NODE_ENV !== "production",
  enhancers: [],
});

export default store;
export type AppDispatch = typeof store.dispatch;
