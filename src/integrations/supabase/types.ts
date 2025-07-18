export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          role: 'user' | 'admin'
          user_type: 'riders' | 'drivers'
          engagement_level: 'high' | 'medium' | 'low' | 'inactive'
          activity_pattern: '7days' | '30days' | '90days' | 'never'
          location: string
          last_active: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          role?: 'user' | 'admin'
          user_type?: 'riders' | 'drivers'
          engagement_level?: 'high' | 'medium' | 'low' | 'inactive'
          activity_pattern?: '7days' | '30days' | '90days' | 'never'
          location?: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          role?: 'user' | 'admin'
          user_type?: 'riders' | 'drivers'
          engagement_level?: 'high' | 'medium' | 'low' | 'inactive'
          activity_pattern?: '7days' | '30days' | '90days' | 'never'
          location?: string
          last_active?: string
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          created_by: string | null
          channel: 'push' | 'sms' | 'email' | 'whatsapp'
          user_type: 'riders' | 'drivers'
          campaign_type: 'reengagement' | 'promotions' | 'loyalty' | 'behavioral'
          engagement_filter: string | null
          activity_filter: string | null
          location_filter: string | null
          number_of_variants: number
          language: string
          tone_style: string | null
          brand_tone: string | null
          desired_outcome: string | null
          generated_message: string | null
          status: 'draft' | 'active' | 'paused' | 'completed'
          estimated_reach: number
          actual_reach: number
          click_through_rate: number
          created_at: string
          updated_at: string
          launched_at: string | null
        }
        Insert: {
          id?: string
          created_by?: string | null
          channel: 'push' | 'sms' | 'email' | 'whatsapp'
          user_type: 'riders' | 'drivers'
          campaign_type: 'reengagement' | 'promotions' | 'loyalty' | 'behavioral'
          engagement_filter?: string | null
          activity_filter?: string | null
          location_filter?: string | null
          number_of_variants?: number
          language?: string
          tone_style?: string | null
          brand_tone?: string | null
          desired_outcome?: string | null
          generated_message?: string | null
          status?: 'draft' | 'active' | 'paused' | 'completed'
          estimated_reach?: number
          actual_reach?: number
          click_through_rate?: number
          created_at?: string
          updated_at?: string
          launched_at?: string | null
        }
        Update: {
          id?: string
          created_by?: string | null
          channel?: 'push' | 'sms' | 'email' | 'whatsapp'
          user_type?: 'riders' | 'drivers'
          campaign_type?: 'reengagement' | 'promotions' | 'loyalty' | 'behavioral'
          engagement_filter?: string | null
          activity_filter?: string | null
          location_filter?: string | null
          number_of_variants?: number
          language?: string
          tone_style?: string | null
          brand_tone?: string | null
          desired_outcome?: string | null
          generated_message?: string | null
          status?: 'draft' | 'active' | 'paused' | 'completed'
          estimated_reach?: number
          actual_reach?: number
          click_through_rate?: number
          created_at?: string
          updated_at?: string
          launched_at?: string | null
        }
      }
      user_segments: {
        Row: {
          id: string
          name: string
          description: string | null
          filters: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          filters: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          filters?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_analytics: {
        Row: {
          id: string
          campaign_id: string | null
          date: string
          impressions: number
          clicks: number
          conversions: number
          click_through_rate: number
          conversion_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          date: string
          impressions?: number
          clicks?: number
          conversions?: number
          click_through_rate?: number
          conversion_rate?: number
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          date?: string
          impressions?: number
          clicks?: number
          conversions?: number
          click_through_rate?: number
          conversion_rate?: number
          created_at?: string
        }
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