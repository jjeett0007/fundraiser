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
  //
  displayName?: string;
  country?: string;
  state?: string;
  city?: string;
  //
  goalAmount?: string;
  title?: string;
  description?: string;
  walletAddress?: string;
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

export type PaginationData = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};


export interface Category {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
}

export interface FundMetaData {
  title: string;
  description: string;
  goalAmount: number;
  currency: string;
  currentAmount: number;
  category: string;
  walletAddress: string;
  imageUrl: string;
  videoUrl: string | null;
}

export interface FundraiserData {
  _id: string;
  fundMetaData: FundMetaData;
  isInitialized: boolean;
  isFundRaiseStarted: boolean;
  isFundRaisedStopped: boolean;
  isFundRaiseFundsComplete: boolean;
  isFundRaisedStartedDate: string;
  isTotalDonor?: number;
}

export interface Donor {
  _id: string;
  name: string;
  email: string;
  amount: number;
  note?: string;
  timestamp: string;
  isAnonymous?: boolean;
}

export interface FundraiserDetailResponse {
  data: FundraiserData;
  donors?: Donor[];
  success: boolean;
  message: string;
}
