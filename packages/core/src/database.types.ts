// =====================================================================
// AUTO-GENERATED from the Supabase schema. Do not edit by hand.
// Regenerate with the Supabase MCP `generate_typescript_types` tool or:
//   supabase gen types typescript --project-id kxxvqrkhiwowkxeszmsy
// =====================================================================
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_assignments: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          credit_limit: number
          currency: string
          id: string
          name: string
          rfc: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          credit_limit?: number
          currency?: string
          id?: string
          name: string
          rfc?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          credit_limit?: number
          currency?: string
          id?: string
          name?: string
          rfc?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          due_at: string | null
          id: string
          issued_at: string | null
          number: string
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          trip_id: string | null
        }
        Insert: {
          amount?: number
          company_id: string
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          issued_at?: string | null
          number: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          trip_id?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          issued_at?: string | null
          number?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          company_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_locations: {
        Row: {
          heading: number | null
          id: number
          lat: number
          lon: number
          recorded_at: string
          speed_kph: number | null
          trip_id: string
        }
        Insert: {
          heading?: number | null
          id?: never
          lat: number
          lon: number
          recorded_at?: string
          speed_kph?: number | null
          trip_id: string
        }
        Update: {
          heading?: number | null
          id?: never
          lat?: number
          lon?: number
          recorded_at?: string
          speed_kph?: number | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_locations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          assigned_employee_id: string | null
          cargo_description: string | null
          company_id: string
          created_at: string
          delivered_at: string | null
          departure_at: string | null
          destination_label: string | null
          destination_lat: number | null
          destination_lon: number | null
          eta: string | null
          id: string
          origin_label: string | null
          origin_lat: number | null
          origin_lon: number | null
          reference: string
          status: Database["public"]["Enums"]["trip_status"]
        }
        Insert: {
          assigned_employee_id?: string | null
          cargo_description?: string | null
          company_id: string
          created_at?: string
          delivered_at?: string | null
          departure_at?: string | null
          destination_label?: string | null
          destination_lat?: number | null
          destination_lon?: number | null
          eta?: string | null
          id?: string
          origin_label?: string | null
          origin_lat?: number | null
          origin_lon?: number | null
          reference: string
          status?: Database["public"]["Enums"]["trip_status"]
        }
        Update: {
          assigned_employee_id?: string | null
          cargo_description?: string | null
          company_id?: string
          created_at?: string
          delivered_at?: string | null
          departure_at?: string | null
          destination_label?: string | null
          destination_lat?: number | null
          destination_lon?: number | null
          eta?: string | null
          id?: string
          origin_label?: string | null
          origin_lat?: number | null
          origin_lon?: number | null
          reference?: string
          status?: Database["public"]["Enums"]["trip_status"]
        }
        Relationships: [
          {
            foreignKeyName: "trips_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      trip_latest_locations: {
        Row: {
          heading: number | null
          id: number | null
          lat: number | null
          lon: number | null
          recorded_at: string | null
          speed_kph: number | null
          trip_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_locations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      auth_user_company: { Args: Record<string, never>; Returns: string }
      auth_user_role: {
        Args: Record<string, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_staff: { Args: Record<string, never>; Returns: boolean }
      simulate_fleet_movement: { Args: Record<string, never>; Returns: undefined }
      track_shipment: {
        Args: { p_ref: string }
        Returns: {
          delivered_at: string | null
          departure_at: string | null
          destination_label: string | null
          eta: string | null
          last_at: string | null
          last_lat: number | null
          last_lon: number | null
          origin_label: string | null
          reference: string
          status: Database["public"]["Enums"]["trip_status"]
        }[]
      }
    }
    Enums: {
      invoice_status: "draft" | "sent" | "paid" | "overdue"
      trip_status:
        | "scheduled"
        | "loading"
        | "in_transit"
        | "delivered"
        | "cancelled"
      user_role: "customer" | "employee" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
