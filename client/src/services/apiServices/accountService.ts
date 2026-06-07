import api from "../api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>("/account/profile");
  return data;
};

export const updateProfile = async (
  profileData: UpdateProfileData,
): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfile>(
    "/account/profile",
    profileData,
  );
  return data;
};

export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<void> => {
  await api.patch("/account/password", passwordData);
};
