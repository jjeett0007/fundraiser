import { Profile, ProfileImages, Address } from "@/utils/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDataInitialState {
  _id: string;
  email: string;
  profile: Profile;
  profileImages: ProfileImages;
  address: Address;
  statics: {
    totalFundRaiseCreated: number;
    totalRaised: number;
  };
  createdAt: string;
}

const initialState: UserDataInitialState = {
  _id: "",
  email: "",
  profile: {
    firstName: "",
    lastName: "",
    displayName: "",
  },
  profileImages: {
    avatar: "",
    backDrop: null,
  },
  address: {
    city: "",
    country: "",
    state: "",
  },
  statics: {
    totalFundRaiseCreated: 0,
    totalRaised: 0,
  },
  createdAt: "",
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Partial<UserDataInitialState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    
    updateUser(
      state,
      action: PayloadAction<{
        firstName?: string;
        lastName?: string;
        displayName?: string;
        city?: string;
        country?: string;
        state?: string;
        avatar?: string;
      }>
    ) {
      return {
        ...state,
        profile: {
          ...state.profile,
          firstName: action.payload.firstName || state.profile.firstName,
          lastName: action.payload.lastName || state.profile.lastName,
          displayName: action.payload.displayName || state.profile.displayName,
        },
        address: {
          ...state.address,
          city: action.payload.city || state.address.city,
          country: action.payload.country || state.address.country,
          state: action.payload.state || state.address.state,
        },
        profileImages: {
          ...state.profileImages,
          avatar: action.payload.avatar || state.profileImages.avatar,
        },
      };
    },
    clearData: () => initialState,
  },
});

export const { setData, clearData, updateUser } = userDataSlice.actions;

export default userDataSlice.reducer;
