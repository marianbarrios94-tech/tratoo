// Escrito a mano para coincidir con supabase/migrations/0001_init.sql.
// Reemplazar por el output de `npx supabase gen types typescript` una vez
// que el esquema se estabilice, manteniendo la misma forma.

export type UserRole = 'client' | 'professional' | 'admin'
export type Vertical = 'hogar' | 'consultoria' | 'salud'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled'
export type RequestStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'
export type ProfileEventType = 'view' | 'whatsapp_click'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          city: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          email?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          vertical: Vertical
          icon: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          vertical: Vertical
          icon?: string | null
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      subscription_plans: {
        Row: {
          id: string
          slug: string
          name: string
          price_monthly: number
          currency: string
          features: string[]
          stripe_price_id: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          price_monthly: number
          currency?: string
          features?: string[]
          stripe_price_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['subscription_plans']['Insert']>
        Relationships: []
      }
      professional_profiles: {
        Row: {
          user_id: string
          category_id: string | null
          custom_profession: string | null
          business_name: string | null
          license_number: string | null
          bio: string | null
          city: string | null
          city_unaccent: string | null
          years_experience: number | null
          verified: boolean
          subscription_plan_id: string | null
          subscription_status: SubscriptionStatus
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          avg_rating: number
          created_at: string
        }
        Insert: {
          user_id: string
          category_id?: string | null
          custom_profession?: string | null
          business_name?: string | null
          license_number?: string | null
          bio?: string | null
          city?: string | null
          years_experience?: number | null
          verified?: boolean
          subscription_plan_id?: string | null
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          avg_rating?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['professional_profiles']['Insert']>
        Relationships: []
      }
      professional_contacts: {
        Row: {
          user_id: string
          phone: string | null
        }
        Insert: {
          user_id: string
          phone?: string | null
        }
        Update: Partial<Database['public']['Tables']['professional_contacts']['Insert']>
        Relationships: []
      }
      service_requests: {
        Row: {
          id: string
          client_id: string
          professional_id: string
          category_id: string | null
          status: RequestStatus
          message: string | null
          scheduled_at: string | null
          quoted_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          professional_id: string
          category_id?: string | null
          status?: RequestStatus
          message?: string | null
          scheduled_at?: string | null
          quoted_price?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['service_requests']['Insert']>
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          request_id: string
          professional_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          professional_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: []
      }
      profile_events: {
        Row: {
          id: string
          professional_id: string
          event_type: ProfileEventType
          created_at: string
        }
        Insert: {
          id?: string
          professional_id: string
          event_type: ProfileEventType
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profile_events']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
