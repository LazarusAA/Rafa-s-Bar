'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderItem, MenuItem } from '@/lib/types';
import { markOrderDelivered } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check } from 'lucide-react';

type OrderWithItems = Order & {
  order_items: (OrderItem & { menu_items: MenuItem })[];
};

export function BartenderKDS() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const supabase = createClient();

  const fetchOrders = async () => {
    // We want orders that are pending
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, menu_items(*))')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
      
    if (data) setOrders(data as any);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('kds')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeliver = async (id: string) => {
      // Optimistic update
      setOrders(prev => prev.filter(o => o.id !== id));
      await markOrderDelivered(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      <AnimatePresence>
        {orders.map(order => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-rafa-card border-2 border-imperial/50 rounded-xl overflow-hidden flex flex-col animate-pulse"
            style={{ animationDuration: '2s' }}
          >
            <div className="bg-imperial text-black p-4 flex justify-between items-center">
              <div className="text-4xl font-black">#{order.table_number}</div>
              <div className="flex items-center gap-1 font-mono text-sm font-bold opacity-75">
                <Clock size={16} />
                <span>{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
            
            <div className="p-4 flex-grow space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b border-zinc-800 pb-2 last:border-0">
                  <span className="font-bold text-lg text-white">{item.quantity}x {item.menu_items.name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleDeliver(order.id)}
              className="m-4 bg-zinc-800 hover:bg-cyber-cyan hover:text-black text-cyber-cyan border border-cyber-cyan font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={24} />
              MARK DELIVERED
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {orders.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-64 text-zinc-500">
          <p className="text-2xl font-bold">No Active Orders</p>
          <p>Time to clean the glasses!</p>
        </div>
      )}
    </div>
  );
}

