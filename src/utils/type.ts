export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
  oldPassword?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  code?: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface ProfileImages {
  avatar: string;
  backDrop: string | null;
}

export interface Address {
  city: string;
  country: string;
  state: string;
}

export interface UserData {
  _id: string;
  email: string;
  profile: Profile;
  profileImages: ProfileImages;
  address: Address;
}

export interface ApiResponse {
  data: UserData;
}
