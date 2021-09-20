import { combineReducers } from "@reduxjs/toolkit";
import signalRReducer from "./signalRHub/signalRHubSlice";

const rootReducer = combineReducers({
  signalR: signalRReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
