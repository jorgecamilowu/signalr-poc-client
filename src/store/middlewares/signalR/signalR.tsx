/* eslint-disable */
import { Action, Dispatch, Middleware } from "redux";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {
  appendMsg,
  updateId,
  updateMsgs,
} from "../../signalRHub/signalRHubSlice";

import { RootState } from "../../rootReducer";

/**
 * T = parameters of the method exposed by the backend
 * S = shape of redux getState result
 * D = redux Dispatch
 */
type Callback<T = any, S = any, D extends Dispatch = Dispatch> = (
  args: T
) => (dispatch: D, getState: () => S) => void;

export const signalRMiddleware =
  (
    connection: HubConnection,
    config: Map<string, Callback>
  ): Middleware<{}, RootState> =>
  (store) => {
    config.forEach((callback, methodName) => {
      // register passed configs
      connection.on(methodName, (args) => {
        callback(args).call(
          store,
          store.dispatch.bind(store),
          store.getState.bind(store)
        );
      });
    });

    /**
     * registers onclose handlers. Can be abstracted to handle
     * dynamic "oncloseConfig" just like the above config
     */
    connection.onclose(() => {
      store.dispatch(updateMsgs([]));
      store.dispatch(updateId(""));
    });

    return (next: Dispatch) => (action: Action) => next(action);
  };

export const signalRHub = new HubConnectionBuilder()
  .withUrl("http://localhost:5000/hub/chat")
  .withAutomaticReconnect()
  .build();

export const config = new Map<string, Callback>([
  [
    "ReceiveNotification",
    (notification: { code: string; description: string }) => (dispatch) => {
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
