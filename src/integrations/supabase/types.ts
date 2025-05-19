export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      apartments: {
        Row: {
          booking_type: string
          description: string
          disable_booked_dates: boolean | null
          id: string
          images: string[] | null
          location: string
          max_nights: number | null
          min_nights: number | null
          name: string
          price: number
        }
        Insert: {
          booking_type?: string
          description: string
          disable_booked_dates?: boolean | null
          id?: string
          images?: string[] | null
          location: string
          max_nights?: number | null
          min_nights?: number | null
          name: string
          price: number
        }
        Update: {
          booking_type?: string
          description?: string
          disable_booked_dates?: boolean | null
          id?: string
          images?: string[] | null
          location?: string
          max_nights?: number | null
          min_nights?: number | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      booking_periods: {
        Row: {
          apartment_id: string
          end_date: string
          id: string
          is_booked: boolean
          start_date: string
        }
        Insert: {
          apartment_id: string
          end_date: string
          id?: string
          is_booked?: boolean
          start_date: string
        }
        Update: {
          apartment_id?: string
          end_date?: string
          id?: string
          is_booked?: boolean
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_periods_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          apartment_id: string
          booking_date: string
          id: string
          period_id: string
          user_email: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          apartment_id: string
          booking_date?: string
          id?: string
          period_id: string
          user_email?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          apartment_id?: string
          booking_date?: string
          id?: string
          period_id?: string
          user_email?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "booking_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      normal_bookings: {
        Row: {
          apartment_id: string
          booking_date: string
          end_date: string
          id: string
          start_date: string
          user_email: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          apartment_id: string
          booking_date?: string
          end_date: string
          id?: string
          start_date: string
          user_email?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          apartment_id?: string
          booking_date?: string
          end_date?: string
          id?: string
          start_date?: string
          user_email?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "normal_bookings_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_sample_booking_periods: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_temp_admin_user: {
        Args: { admin_email: string; admin_password: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
