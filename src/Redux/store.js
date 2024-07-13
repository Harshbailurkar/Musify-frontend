import { configureStore } from "@reduxjs/toolkit";
import musicDataReducer from "./Slices/musicData";
const store = configureStore({
  reducer: {
    musicData: musicDataReducer,
  },
  devTools: true,
});

export default store;
