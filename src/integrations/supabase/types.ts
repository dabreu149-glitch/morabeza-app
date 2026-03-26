// AUTO-GENERATED — DO NOT EDIT
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          mailing_address: string | null;
          is_admin: boolean;
          daily_message_count: number;
          last_message_date: string | null;
          lender_consent: boolean | null;
          lender_consent_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          mailing_address?: string | null;
          is_admin?: boolean;
          daily_message_count?: number;
          last_message_date?: string | null;
          lender_consent?: boolean | null;
          lender_consent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          mailing_address?: string | null;
          is_admin?: boolean;
          daily_message_count?: number;
          last_message_date?: string | null;
          lender_consent?: boolean | null;
          lender_consent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      credit_reports: {
        Row: {
          id: string;
          user_id: string;
          raw_text: string | null;
          parsed_json: Json | null;
          credit_score: number | null;
          utilization: number | null;
          debt_to_income: number | null;
          savings_documented: number;
          status: string;
          uploaded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          raw_text?: string | null;
          parsed_json?: Json | null;
          credit_score?: number | null;
          utilization?: number | null;
          debt_to_income?: number | null;
          savings_documented?: number;
          status?: string;
          uploaded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          raw_text?: string | null;
          parsed_json?: Json | null;
          credit_score?: number | null;
          utilization?: number | null;
          debt_to_income?: number | null;
          savings_documented?: number;
          status?: string;
          uploaded_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      negative_items: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          type: string;
          creditor: string | null;
          amount: number | null;
          disputable: boolean | null;
          dispute_reason: string | null;
          dispute_status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id: string;
          type: string;
          creditor?: string | null;
          amount?: number | null;
          disputable?: boolean | null;
          dispute_reason?: string | null;
          dispute_status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          type?: string;
          creditor?: string | null;
          amount?: number | null;
          disputable?: boolean | null;
          dispute_reason?: string | null;
          dispute_status?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      dispute_letters: {
        Row: {
          id: string;
          item_id: string;
          user_id: string;
          bureau: string;
          letter_text: string;
          status: string;
          generated_at: string;
          sent_at: string | null;
        };
        Insert: {
          id?: string;
          item_id: string;
          user_id: string;
          bureau: string;
          letter_text: string;
          status?: string;
          generated_at?: string;
          sent_at?: string | null;
        };
        Update: {
          id?: string;
          item_id?: string;
          user_id?: string;
          bureau?: string;
          letter_text?: string;
          status?: string;
          generated_at?: string;
          sent_at?: string | null;
        };
        Relationships: [];
      };
      action_plans: {
        Row: {
          id: string;
          user_id: string;
          plan_json: Json;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_json: Json;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_json?: Json;
          pdf_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          step: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          step: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          step?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          event_name: string | null;
          visitor_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_name?: string | null;
          visitor_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_name?: string | null;
          visitor_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: string;
          page: string | null;
          visitor_id: string | null;
          referrer: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          page?: string | null;
          visitor_id?: string | null;
          referrer?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          page?: string | null;
          visitor_id?: string | null;
          referrer?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          language: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          language?: string;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          language?: string;
          source?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          summary: string | null;
          tags: string[] | null;
          embedding: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          summary?: string | null;
          tags?: string[] | null;
          embedding?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          summary?: string | null;
          tags?: string[] | null;
          embedding?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      search_resources: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: Array<{
          id: string;
          title: string;
          content: string;
          category: string;
          summary: string | null;
          similarity: number;
        }>;
      };
      search_resources_text: {
        Args: {
          search_query: string;
          category_filter: string | null;
          result_limit: number;
        };
        Returns: Array<{
          id: string;
          title: string;
          content: string;
          category: string;
          summary: string | null;
          relevance: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insertable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updatable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
