'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitOrder(items: { id: string; quantity: number; price: number }[], tableNumber: string) {
  const supabase = await createClient();
  
  // Calculate total price
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Generate a UUID for the order since we can't SELECT it back as anon
  const orderId = crypto.randomUUID();

  // 1. Create the Order
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId, // Manually set ID
      table_number: tableNumber,
      total_price: totalPrice,
      status: 'pending'
    });

  if (orderError) {
    console.error('Order error:', orderError);
    return { error: orderError.message };
  }

  // 2. Create Order Items linked to that ID
  const orderItems = items.map(item => ({
    order_id: orderId,
    menu_item_id: item.id,
    quantity: item.quantity,
    price_at_time_of_order: item.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Order items error:', itemsError);
    // Note: In a real app, we might want to rollback the order here, 
    // but Supabase doesn't support multi-table transactions via client library easily without RPC.
    return { error: itemsError.message };
  }

  return { success: true, orderId };
}

export async function voteGenre(genre: 'a' | 'b') {
  const supabase = await createClient();
  
  const { data: battle, error: fetchError } = await supabase
    .from('genre_battles')
    .select('id')
    .eq('is_active', true)
    .single();
    
  if (fetchError || !battle) return { error: 'No active battle found' };
  
  const { error: rpcError } = await supabase
    .rpc('vote_for_genre', {
      battle_id: battle.id,
      choice: genre
    });
    
  if (rpcError) {
    console.error('Vote error:', rpcError);
    return { error: rpcError.message };
  }
  
  revalidatePath('/');
  return { success: true };
}

export async function markOrderDelivered(orderId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status: 'delivered' })
    .eq('id', orderId);

  if (error) return { error: error.message };
  
  revalidatePath('/admin');
  return { success: true };
}
