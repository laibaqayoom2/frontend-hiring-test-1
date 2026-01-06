export interface Call {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  via: string;
  duration: number;
  is_archived: boolean;
  call_type: 'answered' | 'missed' | 'voicemail';
  created_at: string;
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  created_at: string;
}

export interface CallsResponse {
  nodes: Call[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    username: string;
  };
}

export type CallFilter = 'all' | 'archived' | 'unarchived' | 'missed' | 'answered' | 'voicemail';

export interface GroupedCalls {
  [date: string]: Call[];
}