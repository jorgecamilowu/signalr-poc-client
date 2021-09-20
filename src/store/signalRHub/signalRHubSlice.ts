import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  msgs: string[];
  status: string;
  id: string;
};

const initialState: State = {
  msgs: [],
  status: "",
  id: "",
};

const signalRSlice = createSlice({
  name: "signalR",
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    appendMsg: (state, action: PayloadAction<string>) => {
      state.msgs.push(action.payload);
    },
    updateMsgs: (state, action: PayloadAction<string[]>) => {
      state.msgs = action.payload;
    },
  },
});

export const { updateId, updateStatus, appendMsg, updateMsgs } =
  signalRSlice.actions;
export default signalRSlice.reducer;
