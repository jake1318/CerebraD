import { configureStore } from "@reduxjs/toolkit";

// No theme slice is needed now – if you need additional reducers later, add them here.
const store = configureStore({
  reducer: {},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
