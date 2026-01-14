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
      site_settings: {
        Row: {
          id: string
          logo_url: string | null
          hero_image_url: string | null
          site_title: string | null
          site_description: string | null
          google_analytics_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          hero_image_url?: string | null
          site_title?: string | null
          site_description?: string | null
          google_analytics_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          hero_image_url?: string | null
          site_title?: string | null
          site_description?: string | null
          google_analytics_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image_url: string | null
          status: 'draft' | 'published'
          published_at: string | null
          author_id: string | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          cover_image_url?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
          author_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          cover_image_url?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
          author_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed: boolean
          unsubscribe_token: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          subscribed?: boolean
          unsubscribe_token?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          subscribed?: boolean
          unsubscribe_token?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
