export interface SharedWithMeMedia {
  media_id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  share_id: string;
  shared_at: string;
  permission: "view" | "download";
  owner: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  };
}
