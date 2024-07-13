import { createSlice } from "@reduxjs/toolkit";

const musicDataSlice = createSlice({
  name: "musicData",
  initialState: [],
  reducers: {
    setMusicData: (state, action) => {
      return action.payload;
    },
  },
});
export const { setMusicData } = musicDataSlice.actions;
export default musicDataSlice.reducer;
