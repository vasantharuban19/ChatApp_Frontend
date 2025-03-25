import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import otherSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

// 🔹 Persist Configuration (Only persist `authSlice`, not API data)
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAdmin"], // Persist both user & isAdmin
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [otherSlice.name]: otherSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for Redux Persist
    }),
    api.middleware,
  ],
});

export const persistor = persistStore(store);
export default store;
