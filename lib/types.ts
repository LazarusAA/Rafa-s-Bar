export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ItemCategory = 'beers' | 'cocktails' | 'food' | 'shots' | 'non_alcoholic';
export type OrderStatus = 'pending' | 'delivered' | 'canceled';

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ItemCategory;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  table_number: string;
  status: OrderStatus;
  total_price: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time_of_order: number;
  created_at: string;
  // Virtual field for joins
  menu_item?: MenuItem;
}

export interface GenreBattle {
  id: string;
  genre_a_name: string;
  genre_b_name: string;
  votes_a: number;
  votes_b: number;
  is_active: boolean;
  created_at: string;
}

export interface FlashPromo {
  id: string;
  message_text: string;
  is_active: boolean;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, 'id' | 'created_at'>;
        Update: Partial<Omit<MenuItem, 'id' | 'created_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'created_at' | 'total_price'> & { id?: string; total_price?: number };
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at'>;
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
      };
      genre_battles: {
        Row: GenreBattle;
        Insert: Omit<GenreBattle, 'id' | 'created_at'>;
        Update: Partial<Omit<GenreBattle, 'id' | 'created_at'>>;
      };
      flash_promos: {
        Row: FlashPromo;
        Insert: Omit<FlashPromo, 'id' | 'created_at'>;
        Update: Partial<Omit<FlashPromo, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      vote_for_genre: {
        Args: { battle_id: string; choice: 'a' | 'b' };
        Returns: void;
      };
    };
  };
};
