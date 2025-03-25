import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";
import { toast } from "react-hot-toast";

const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isAdmin = true;
        toast.success(action.payload);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.isAdmin = !!action.payload;
        state.user = action.payload || null;
      })
      .addCase(getAdmin.rejected, (state) => {
        state.isAdmin = false;
        state.user = null;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.isAdmin = false;
        state.user = null;
        toast.success(action.payload);
      })
      .addCase(adminLogout.rejected, (state, action) => {
        toast.error(action.error.message);
      });
  },
});

export default authSlice;

export const { userExists, userNotExists } = authSlice.actions;
