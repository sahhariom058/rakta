export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blood_requests: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string
          hospital_location: string
          hospital_name: string
          hospital_user_id: string | null
          id: string
          latitude: number | null
          longitude: number | null
          required_blood_group: Database["public"]["Enums"]["blood_group"]
          status: Database["public"]["Enums"]["request_status"]
          units_needed: number
          updated_at: string
          urgency: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string
          hospital_location: string
          hospital_name: string
          hospital_user_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          required_blood_group: Database["public"]["Enums"]["blood_group"]
          status?: Database["public"]["Enums"]["request_status"]
          units_needed: number
          updated_at?: string
          urgency?: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          hospital_location?: string
          hospital_name?: string
          hospital_user_id?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          required_blood_group?: Database["public"]["Enums"]["blood_group"]
          status?: Database["public"]["Enums"]["request_status"]
          units_needed?: number
          updated_at?: string
          urgency?: string
        }
        Relationships: []
      }
      donor_public_cards: {
        Row: {
          availability: string
          blood_group: string
          city_area: string
          donor_created_at: string
          donor_id: string
          is_verified: boolean
          masked_name: string
          updated_at: string
        }
        Insert: {
          availability: string
          blood_group: string
          city_area: string
          donor_created_at?: string
          donor_id: string
          is_verified?: boolean
          masked_name: string
          updated_at?: string
        }
        Update: {
          availability?: string
          blood_group?: string
          city_area?: string
          donor_created_at?: string
          donor_id?: string
          is_verified?: boolean
          masked_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          availability: Database["public"]["Enums"]["availability_status"]
          blood_group: Database["public"]["Enums"]["blood_group"]
          city_area: string
          created_at: string
          full_name: string
          id: string
          is_verified: boolean
          last_donation_date: string | null
          latitude: number | null
          longitude: number | null
          phone: string
          profile_photo_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability?: Database["public"]["Enums"]["availability_status"]
          blood_group: Database["public"]["Enums"]["blood_group"]
          city_area: string
          created_at?: string
          full_name: string
          id?: string
          is_verified?: boolean
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          phone: string
          profile_photo_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_status"]
          blood_group?: Database["public"]["Enums"]["blood_group"]
          city_area?: string
          created_at?: string
          full_name?: string
          id?: string
          is_verified?: boolean
          last_donation_date?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string
          profile_photo_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      request_matches: {
        Row: {
          created_at: string
          distance_km: number | null
          donor_id: string
          id: string
          request_id: string
          response_status: string
        }
        Insert: {
          created_at?: string
          distance_km?: number | null
          donor_id: string
          id?: string
          request_id: string
          response_status?: string
        }
        Update: {
          created_at?: string
          distance_km?: number | null
          donor_id?: string
          id?: string
          request_id?: string
          response_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_matches_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "public_donor_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_donor_directory: {
        Row: {
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          blood_group: Database["public"]["Enums"]["blood_group"] | null
          city_area: string | null
          created_at: string | null
          id: string | null
          is_verified: boolean | null
          masked_name: string | null
          profile_photo_url: string | null
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          city_area?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          masked_name?: never
          profile_photo_url?: string | null
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          blood_group?: Database["public"]["Enums"]["blood_group"] | null
          city_area?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          masked_name?: never
          profile_photo_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hospital" | "donor"
      availability_status: "available" | "not_available"
      blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      request_status: "open" | "matched" | "fulfilled" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "hospital", "donor"],
      availability_status: ["available", "not_available"],
      blood_group: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      request_status: ["open", "matched", "fulfilled", "cancelled"],
    },
  },
} as const
