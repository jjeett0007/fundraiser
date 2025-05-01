import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserTokenState {
  token: string | null;
  expiresIn: string | null;
  isAuthenticated: boolean;
}

const initialState: UserTokenState = {
  token: null,
  expiresIn: null,
  isAuthenticated: false,
};

const userTokenSlice = createSlice({
  name: "userToken",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<Partial<UserTokenState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearToken: () => initialState,
  },
});

export const { setToken, clearToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;
