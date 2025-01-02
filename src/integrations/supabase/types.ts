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
      birth_charts: {
        Row: {
          ascendant_degrees: number | null
          ascendant_minutes: number | null
          ascendant_sign: string | null
          birth_date: string
          birth_place: string | null
          birth_time: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          moon_degrees: number | null
          moon_minutes: number | null
          moon_sign: string | null
          name: string
          sun_degrees: number | null
          sun_minutes: number | null
          sun_sign: string | null
          system_used: string | null
          user_id: string | null
        }
        Insert: {
          ascendant_degrees?: number | null
          ascendant_minutes?: number | null
          ascendant_sign?: string | null
          birth_date: string
          birth_place?: string | null
          birth_time: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          moon_degrees?: number | null
          moon_minutes?: number | null
          moon_sign?: string | null
          name: string
          sun_degrees?: number | null
          sun_minutes?: number | null
          sun_sign?: string | null
          system_used?: string | null
          user_id?: string | null
        }
        Update: {
          ascendant_degrees?: number | null
          ascendant_minutes?: number | null
          ascendant_sign?: string | null
          birth_date?: string
          birth_place?: string | null
          birth_time?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          moon_degrees?: number | null
          moon_minutes?: number | null
          moon_sign?: string | null
          name?: string
          sun_degrees?: number | null
          sun_minutes?: number | null
          sun_sign?: string | null
          system_used?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "birth_charts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interpretations: {
        Row: {
          birth_chart_id: string
          content: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          birth_chart_id: string
          content: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          birth_chart_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interpretations_birth_chart_id_fkey"
            columns: ["birth_chart_id"]
            isOneToOne: false
            referencedRelation: "birth_charts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interpretations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      myers_briggs_results: {
        Row: {
          created_at: string
          extroversion_score: number
          id: string
          intuition_score: number
          judging_score: number
          personality_type: string
          thinking_score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          extroversion_score: number
          id?: string
          intuition_score: number
          judging_score: number
          personality_type: string
          thinking_score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          extroversion_score?: number
          id?: string
          intuition_score?: number
          judging_score?: number
          personality_type?: string
          thinking_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "myers_briggs_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_subscribed: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_subscribed?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_subscribed?: boolean | null
        }
        Relationships: []
      }
      sidereal_zodiac: {
        Row: {
          created_at: string
          element: string
          id: string
          quality: string
          representation: string
          ruling_body: string[]
          sanskrit_name: string
          sanskrit_transliteration: string
          sign: string
          starting_degree: number
        }
        Insert: {
          created_at?: string
          element: string
          id?: string
          quality: string
          representation: string
          ruling_body: string[]
          sanskrit_name: string
          sanskrit_transliteration: string
          sign: string
          starting_degree: number
        }
        Update: {
          created_at?: string
          element?: string
          id?: string
          quality?: string
          representation?: string
          ruling_body?: string[]
          sanskrit_name?: string
          sanskrit_transliteration?: string
          sign?: string
          starting_degree?: number
        }
        Relationships: []
      }
      tropical_zodiac: {
        Row: {
          approx_sun_end: string
          approx_sun_start: string
          classic_ruler: string
          created_at: string
          ecliptic_end_deg: number
          ecliptic_start_deg: number
          gloss: string
          house: number
          id: string
          modality: string
          modern_ruler: string
          northern_hemisphere_season: string
          polarity: string
          sign: string
          southern_hemisphere_season: string
          triplicity: string
          unicode_character: string
        }
        Insert: {
          approx_sun_end: string
          approx_sun_start: string
          classic_ruler: string
          created_at?: string
          ecliptic_end_deg: number
          ecliptic_start_deg: number
          gloss: string
          house: number
          id?: string
          modality: string
          modern_ruler: string
          northern_hemisphere_season: string
          polarity: string
          sign: string
          southern_hemisphere_season: string
          triplicity: string
          unicode_character: string
        }
        Update: {
          approx_sun_end?: string
          approx_sun_start?: string
          classic_ruler?: string
          created_at?: string
          ecliptic_end_deg?: number
          ecliptic_start_deg?: number
          gloss?: string
          house?: number
          id?: string
          modality?: string
          modern_ruler?: string
          northern_hemisphere_season?: string
          polarity?: string
          sign?: string
          southern_hemisphere_season?: string
          triplicity?: string
          unicode_character?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
