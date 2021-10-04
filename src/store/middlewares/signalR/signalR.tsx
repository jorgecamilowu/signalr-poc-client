/* eslint-disable */
import { Action, Dispatch, Middleware } from "redux";
import { ThunkAction } from "@reduxjs/toolkit";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {
  appendMsg,
  updateId,
  updateMsgs,
} from "../../signalRHub/signalRHubSlice";

import { RootState } from "../../rootReducer";

/**
 * Action Thunk with args passed by the connection hub
 * T = parameters of the method passed by the connection hub
 * S = shape of redux getState result
 * D = redux Dispatch
 */
export type Callback<T = any, S = RootState, D extends Dispatch = Dispatch> = (
  args: T
) => (dispatch: D, getState: () => S) => void;

/** Default ThunkAction */
export type DefaultAppThunk = ThunkAction<
  void,
  RootState,
  undefined,
  Action<string>
>;

export const signalRMiddleware =
  (
    connection: HubConnection,
    methodsConfig: Map<string, Callback>,
    onCloseConfig: DefaultAppThunk[]
  ): Middleware<{}, RootState> =>
  (store) => {
    methodsConfig.forEach((callback, methodName) => {
      /** Registers available methods for the connection hub */
      connection.on(methodName, (args) => {
        callback(args).call(
          store,
          store.dispatch.bind(store),
          store.getState.bind(store)
        );
      });
    });

    /** Register onClose side effects */
    onCloseConfig.forEach((action) => {
      connection.onclose(() => {
        action.call(
          store,
          store.dispatch.bind(store),
          store.getState.bind(store),
          undefined
        );
      });
    });

    return (next: Dispatch) => (action: Action) => next(action);
  };

export const signalRHub = new HubConnectionBuilder()
  .withUrl("http://localhost:5000/hub/notification")
  .withAutomaticReconnect()
  .build();

/** Configure methods available for the connection hub */
export const methodsConfig = new Map<string, Callback>([
  [
    "ReceiveNotification",
    (notification: { code: string; description: string }) =>
      (dispatch: Dispatch) => {
        dispatch(appendMsg(notification.description));
      },
  ],
  [
    "ReceiveBroadcast",
    (broadcastMsg: { type: string; content: string; sender: string }) =>
      (dispatch) => {
        dispatch(appendMsg(broadcastMsg.content));
      },
  ],
]);

/** Configure side effects to trigger when the connection closes */
export const onCloseConfig: DefaultAppThunk[] = [
  (dispatch) => {
    dispatch(updateMsgs([]));
  },
  (dispatch) => {
    dispatch(updateId(""));
  },
];
