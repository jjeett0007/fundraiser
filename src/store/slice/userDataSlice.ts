import { UserData, Profile, ProfileImages, Address } from "@/utils/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDataState {
  data: UserData | null;
}

const initialState: UserDataState = {
  data: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Partial<UserDataState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateProfile(state, action: PayloadAction<Partial<Profile>>) {
      if (state.data) {
        state.data.profile = {
          ...state.data.profile,
          ...action.payload,
        };
      }
    },
    updateProfileImage(state, action: PayloadAction<Partial<ProfileImages>>) {
      if (state.data) {
        state.data.profileImages = {
          ...state.data.profileImages,
          ...action.payload,
        };
      }
    },
    updateAddress(state, action: PayloadAction<Partial<Address>>) {
      if (state.data) {
        state.data.address = {
          ...state.data.address,
          ...action.payload,
        };
      }
    },
    clearData: () => initialState,
  },
});

export const {
  setData,
  clearData,
  updateProfile,
  updateProfileImage,
  updateAddress,
} = userDataSlice.actions;

export default userDataSlice.reducer;
