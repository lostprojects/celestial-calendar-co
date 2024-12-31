export interface ProfilesTable {
  Row: {
    id: string;
    avatar_url: string | null;
    created_at: string;
    full_name: string | null;
  };
  Insert: {
    id: string;
    avatar_url?: string | null;
    created_at?: string;
    full_name?: string | null;
  };
  Update: {
    id?: string;
    avatar_url?: string | null;
    created_at?: string;
    full_name?: string | null;
  };
  Relationships: [];
}