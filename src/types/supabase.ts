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
      archivos: {
        Row: {
          id: number
          semana_id: number | null
          nombre: string
          github_url: string
          fecha_subida: string | null
        }
        Insert: {
          id?: number
          semana_id?: number | null
          nombre: string
          github_url: string
          fecha_subida?: string | null
        }
        Update: {
          id?: number
          semana_id?: number | null
          nombre?: string
          github_url?: string
          fecha_subida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "archivos_semana_id_fkey"
            columns: ["semana_id"]
            referencedRelation: "semanas"
            referencedColumns: ["id"]
          },
        ]
      }
      semanas: {
        Row: {
          id: number
          titulo: string
          numero: number
          habilitada: boolean
          fecha_creacion: string | null
        }
        Insert: {
          id?: number
          titulo: string
          numero: number
          habilitada?: boolean
          fecha_creacion?: string | null
        }
        Update: {
          id?: number
          titulo?: string
          numero?: number
          habilitada?: boolean
          fecha_creacion?: string | null
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

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
