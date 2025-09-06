export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}