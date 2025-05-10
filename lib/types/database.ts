export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          is_anonymous: boolean
          is_public_results: boolean
          is_realtime_results: boolean
          vote_type: "single" | "multiple" | "ranked"
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
          status: "draft" | "active" | "completed"
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          is_anonymous?: boolean
          is_public_results?: boolean
          is_realtime_results?: boolean
          vote_type: "single" | "multiple" | "ranked"
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
          status?: "draft" | "active" | "completed"
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          is_anonymous?: boolean
          is_public_results?: boolean
          is_realtime_results?: boolean
          vote_type?: "single" | "multiple" | "ranked"
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
          status?: "draft" | "active" | "completed"
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          ranking: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          ranking?: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          ranking?: number
          created_at?: string
        }
      }
      poll_invitations: {
        Row: {
          id: string
          poll_id: string
          email: string
          status: "pending" | "accepted"
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          email: string
          status?: "pending" | "accepted"
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          email?: string
          status?: "pending" | "accepted"
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Poll = Database["public"]["Tables"]["polls"]["Row"]
export type PollOption = Database["public"]["Tables"]["poll_options"]["Row"]
export type Vote = Database["public"]["Tables"]["votes"]["Row"]
export type PollInvitation = Database["public"]["Tables"]["poll_invitations"]["Row"]

export type PollWithOptions = Poll & {
  options: PollOption[]
  _count?: {
    votes: number
  }
}

export type PollWithOptionsAndVotes = PollWithOptions & {
  votes: Vote[]
}
