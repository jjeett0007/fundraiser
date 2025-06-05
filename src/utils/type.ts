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
  statics: {
    totalFundRaiseCreated: number;
    totalRaised: number;
  };
  createdAt: string;
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
}

export interface FundMetaData {
  title: string;
  description: string;
  goalAmount: number;
  currency: string;
  currentAmount: number;
  category: string;
  walletAddress?: string;
  imageUrl: string;
  videoUrl: string | null;
}
export interface Statics {
  totalRaised: number;
  totalDonor: number;
  averageDonation: number;
  largestAmount: number;
  lastPaymentTime: null | string;
}

export interface Verified {
  isFundRaiseVerified: boolean;
  isFundRaiseVerifiedDate: string;
}
export interface FundraiserData {
  _id: string;
  fundMetaData: FundMetaData;
  verify: {
    isFundRaiseVerified: boolean;
  };
  statics: Statics;
  isFundRaiseDeactivated: boolean;
  isFundRaisedStartedDate: string;
}

export interface FundraiserByIdData {
  _id: string;
  fundMetaData: FundMetaData;
  verify: Verified;
  statics: Statics;
  isInitialized: boolean;
  isFundRaiseStarted: boolean;
  isFundRaisedStopped: boolean;
  isFundRaiseFundsComplete: boolean;
  isFundRaiseDeactivated: boolean;
  isFundRaisedStartedDate: string;
}

export interface DonorByIdData {
  name: string;
  amount: number;
  note: string;
  anonymous: boolean;
  isFundPaid: boolean;
  walletAddress: string;
  blockTime: string;
  updatedAt: string;
}

export interface GetDonorInfoData {
  _id: string;
  name: string;
  email: string;
  amount: number;
  note: string;
  anonymous: false;
  walletAddress: string;
}
