export interface Profile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  username?: string;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface ProfileError {
  error: string;
}
