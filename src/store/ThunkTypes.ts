import { ThunkAction } from "redux-thunk";
import { Action, Dispatch, AnyAction } from "redux";
import { RootState } from "./rootReducer";
import { HubConnection } from "@microsoft/signalr";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  HubConnection, // dependency injection for HubConnection
  Action<string>
>;
export type AsyncAppThunk = AppThunk<Promise<AnyAction>>;
export type AsyncDispatch = Dispatch;
