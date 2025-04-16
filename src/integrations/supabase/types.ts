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
      customer_profile: {
        Row: {
          balance: number | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          currency_id: string | null
          custom_fields: Json | null
          display_name: string
          email: string | null
          fax: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          last_sync_at: string | null
          mobile: string | null
          notes: string | null
          organization_id: string | null
          payment_terms: string | null
          phone: string | null
          qbo_id: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          sync_status: string | null
          tax_exempt: boolean | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          balance?: number | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          sync_status?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          balance?: number | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name?: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          sync_status?: string | null
          tax_exempt?: boolean | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_profile_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_profile_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_profile_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance: number | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          customer_id: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          last_sync_at: string | null
          memo: string | null
          organization_id: string | null
          qbo_id: string | null
          status: string | null
          sync_status: string | null
          terms: string | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          qbo_id?: string | null
          status?: string | null
          sync_status?: string | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          customer_id?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          qbo_id?: string | null
          status?: string | null
          sync_status?: string | null
          terms?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      item_inventory: {
        Row: {
          average_cost: number | null
          created_at: string | null
          id: string
          item_id: string | null
          last_inventory_date: string | null
          last_sync_at: string | null
          location: string | null
          quantity_available: number | null
          quantity_on_hand: number | null
          quantity_on_order: number | null
          quantity_reserved: number | null
          updated_at: string | null
          warehouse_id: string | null
        }
        Insert: {
          average_cost?: number | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          last_inventory_date?: string | null
          last_sync_at?: string | null
          location?: string | null
          quantity_available?: number | null
          quantity_on_hand?: number | null
          quantity_on_order?: number | null
          quantity_reserved?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Update: {
          average_cost?: number | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          last_inventory_date?: string | null
          last_sync_at?: string | null
          location?: string | null
          quantity_available?: number | null
          quantity_on_hand?: number | null
          quantity_on_order?: number | null
          quantity_reserved?: number | null
          updated_at?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      item_pricing: {
        Row: {
          created_at: string | null
          currency_id: string | null
          effective_date: string | null
          expiration_date: string | null
          id: string
          item_id: string | null
          price: number
          price_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency_id?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          id?: string
          item_id?: string | null
          price: number
          price_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency_id?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          id?: string
          item_id?: string | null
          price?: number
          price_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_pricing_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
        ]
      }
      item_record: {
        Row: {
          asset_account_id: string | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          expense_account_id: string | null
          id: string
          income_account_id: string | null
          is_active: boolean | null
          is_taxable: boolean | null
          item_type: string | null
          last_sync_at: string | null
          manufacturer: string | null
          manufacturer_part_number: string | null
          name: string
          organization_id: string | null
          purchase_cost: number | null
          purchase_description: string | null
          qbo_id: string | null
          reorder_point: number | null
          size: string | null
          size_unit: string | null
          sku: string | null
          sync_status: string | null
          tax_code: string | null
          tax_rate: number | null
          updated_at: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          asset_account_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          expense_account_id?: string | null
          id?: string
          income_account_id?: string | null
          is_active?: boolean | null
          is_taxable?: boolean | null
          item_type?: string | null
          last_sync_at?: string | null
          manufacturer?: string | null
          manufacturer_part_number?: string | null
          name: string
          organization_id?: string | null
          purchase_cost?: number | null
          purchase_description?: string | null
          qbo_id?: string | null
          reorder_point?: number | null
          size?: string | null
          size_unit?: string | null
          sku?: string | null
          sync_status?: string | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          asset_account_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          expense_account_id?: string | null
          id?: string
          income_account_id?: string | null
          is_active?: boolean | null
          is_taxable?: boolean | null
          item_type?: string | null
          last_sync_at?: string | null
          manufacturer?: string | null
          manufacturer_part_number?: string | null
          name?: string
          organization_id?: string | null
          purchase_cost?: number | null
          purchase_description?: string | null
          qbo_id?: string | null
          reorder_point?: number | null
          size?: string | null
          size_unit?: string | null
          sku?: string | null
          sync_status?: string | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_record_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          name: string
          plan_type: string | null
          qbo_access_token: string | null
          qbo_company_id: string | null
          qbo_realm_id: string | null
          qbo_refresh_token: string | null
          qbo_token_expires_at: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name: string
          plan_type?: string | null
          qbo_access_token?: string | null
          qbo_company_id?: string | null
          qbo_realm_id?: string | null
          qbo_refresh_token?: string | null
          qbo_token_expires_at?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          name?: string
          plan_type?: string | null
          qbo_access_token?: string | null
          qbo_company_id?: string | null
          qbo_realm_id?: string | null
          qbo_refresh_token?: string | null
          qbo_token_expires_at?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchase_order: {
        Row: {
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          exchange_rate: number | null
          expected_date: string | null
          id: string
          last_sync_at: string | null
          memo: string | null
          organization_id: string | null
          po_date: string | null
          purchase_order_number: string | null
          qbo_id: string | null
          ship_to: string | null
          status: string | null
          sync_status: string | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          exchange_rate?: number | null
          expected_date?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          po_date?: string | null
          purchase_order_number?: string | null
          qbo_id?: string | null
          ship_to?: string | null
          status?: string | null
          sync_status?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          exchange_rate?: number | null
          expected_date?: string | null
          id?: string
          last_sync_at?: string | null
          memo?: string | null
          organization_id?: string | null
          po_date?: string | null
          purchase_order_number?: string | null
          qbo_id?: string | null
          ship_to?: string | null
          status?: string | null
          sync_status?: string | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_line_item: {
        Row: {
          amount: number | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          id: string
          item_id: string | null
          last_sync_at: string | null
          position: number | null
          purchase_order_id: string | null
          quantity: number | null
          rate: number | null
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          purchase_order_id?: string | null
          quantity?: number | null
          rate?: number | null
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          id?: string
          item_id?: string | null
          last_sync_at?: string | null
          position?: number | null
          purchase_order_id?: string | null
          quantity?: number | null
          rate?: number | null
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_line_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_record"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_line_item_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_order"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organizations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          organization_id: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          organization_id?: string | null
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          organization_id?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_profile: {
        Row: {
          account_number: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_postal_code: string | null
          billing_state: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          currency_id: string | null
          custom_fields: Json | null
          display_name: string
          email: string | null
          fax: string | null
          first_name: string | null
          id: string
          is_1099: boolean | null
          is_active: boolean | null
          last_name: string | null
          last_sync_at: string | null
          mobile: string | null
          notes: string | null
          organization_id: string | null
          payment_terms: string | null
          phone: string | null
          qbo_id: string | null
          sync_status: string | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          account_number?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_1099?: boolean | null
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          sync_status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          account_number?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency_id?: string | null
          custom_fields?: Json | null
          display_name?: string
          email?: string | null
          fax?: string | null
          first_name?: string | null
          id?: string
          is_1099?: boolean | null
          is_active?: boolean | null
          last_name?: string | null
          last_sync_at?: string | null
          mobile?: string | null
          notes?: string | null
          organization_id?: string | null
          payment_terms?: string | null
          phone?: string | null
          qbo_id?: string | null
          sync_status?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profile_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profile_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profile_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          requested_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "sales_rep" | "warehouse"
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
      app_role: ["admin", "sales_rep", "warehouse"],
    },
  },
} as const
