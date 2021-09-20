import axios from "axios";
import { AnyAction } from "@reduxjs/toolkit";
import { AppThunk, AsyncAppThunk } from "../ThunkTypes";
import { updateId, updateStatus, updateMsgs } from "./signalRHubSlice";

export const startConnection =
  (): AsyncAppThunk =>
  async (dispatch, _, signalRHub): Promise<AnyAction> => {
    try {
      await signalRHub.start();
      dispatch(updateStatus("connected"));
      return dispatch(updateId(signalRHub.connectionId || ""));
    } catch (e) {
      // error handling
      console.log(e);
      dispatch(updateStatus("failed to start connection"));
      return dispatch(updateId(""));
    }
  };

export const stopConnection =
  (): AsyncAppThunk =>
  async (dispatch, getState, signalRHub): Promise<AnyAction> => {
    await signalRHub.stop();
    dispatch(updateId(""));
    return dispatch(updateStatus("disconnected"));
  };

export const broadcastAction =
  (): AppThunk =>
  (dispatch, getState, signalRHub): void => {
    signalRHub.invoke("Broadcast", {
      type: "Critical",
      content: "Broadcasted message",
      sender: "signalR-client",
    });
  };

export const resetNotifications =
  (): AppThunk =>
  (dispatch): void => {
    dispatch(updateMsgs([]));
  };

export const subscribe =
  (): AppThunk<Promise<void>> =>
  async (_, getState): Promise<void> => {
    const { id } = getState().signalR;

    try {
      if (id === "") {
        throw new Error("received empty connection id");
      }
      await axios.post(
        `http://localhost:5000/Notification/Subscriptions/?id=${id}`
      );
    } catch (e) {
      // error handling
      console.log(e);
    }
  };
