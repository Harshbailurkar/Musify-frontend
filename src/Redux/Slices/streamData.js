import { createSlice } from "@reduxjs/toolkit";

const streamDataSlice = createSlice({
  name: "streamData",
  initialState: [],
  reducers: {
    setMusicData: (state, action) => {
      return action.payload;
    },
  },
});
export const { setstreamData } = musicDataSlice.actions;
export default musicDataSlice.reducer;
