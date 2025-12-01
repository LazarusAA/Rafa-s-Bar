'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderItem, MenuItem } from '@/lib/types';
import { markOrderDelivered } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, AlertCircle } from 'lucide-react';

type OrderWithItems = Order & {
  order_items: (OrderItem & { menu_items: MenuItem })[];
};

export function BartenderKDS() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const supabase = createClient();

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, menu_items(*))')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (data) setOrders(data as any);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('kds_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeliver = async (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await markOrderDelivered(id);
  };

  const getOrderAge = (createdAt: string) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return minutes;
  };

  return (
    <div className="min-h-screen bg-rafa-base p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-black text-imperial uppercase tracking-tight drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
          Kitchen Display
        </h1>
        <p className="text-zinc-400 text-lg font-bold mt-2">
          {orders.length} {orders.length === 1 ? 'orden pendiente' : 'órdenes pendientes'}
        </p>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => {
            const age = getOrderAge(order.created_at);
            const isUrgent = age >= 5;
            const isCritical = age >= 10;

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                className={`
                  bg-rafa-card rounded-3xl overflow-hidden flex flex-col shadow-2xl
                  border-4 transition-all
                  ${
                    isCritical
                      ? 'border-danger animate-pulse-glow shadow-danger/50'
                      : isUrgent
                      ? 'border-imperial/70 shadow-imperial/30'
                      : 'border-cyber-cyan/50 shadow-cyber-cyan/20'
                  }
                `}
              >
                {/* HEADER - TABLE NUMBER (HUGE) */}
                <div
                  className={`
                  p-6 flex justify-between items-center
                  ${
                    isCritical
                      ? 'bg-danger text-white'
                      : isUrgent
                      ? 'bg-imperial text-black'
                      : 'bg-cyber-cyan text-black'
                  }
                `}
                >
                  <div>
                    <p className="text-xs font-bold uppercase opacity-75 tracking-wider">
                      Mesa
                    </p>
                    <p className="text-6xl sm:text-7xl font-black leading-none">
                      {order.table_number}
                    </p>
                  </div>

                  <div className="text-right">
                    {isCritical && <AlertCircle size={32} className="mb-2" />}
                    <div className="flex items-center gap-2 font-mono text-sm font-bold opacity-90">
                      <Clock size={18} />
                      <span>
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-bold mt-1 opacity-75">
                      {age < 1 ? 'AHORA' : `${age} min`}
                    </p>
                  </div>
                </div>

                {/* BODY - ITEMS LIST */}
                <div className="p-6 flex-grow space-y-3 bg-zinc-900/50">
                  {order.order_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-rafa-card rounded-xl p-4 border-2 border-zinc-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-imperial font-black text-3xl min-w-[3ch]">
                          {item.quantity}×
                        </span>
                        <span className="font-bold text-white text-xl flex-grow ml-4">
                          {item.menu_items.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER - ACTION BUTTON */}
                <div className="p-6 bg-zinc-900">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeliver(order.id)}
                    className="w-full bg-cyber-cyan/20 hover:bg-cyber-cyan text-cyber-cyan hover:text-black border-2 border-cyber-cyan font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-xl uppercase shadow-lg shadow-cyber-cyan/20"
                  >
                    <Check size={28} strokeWidth={3} />
                    Entregado
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-[60vh] text-center"
        >
          <div className="bg-rafa-card p-12 rounded-3xl border-2 border-zinc-800">
            <p className="text-5xl font-black text-zinc-700 mb-4">Todo Listo</p>
            <p className="text-zinc-500 text-xl">No hay órdenes pendientes</p>
            <p className="text-zinc-600 text-lg mt-2">¡Momento perfecto para limpiar! 🧹</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

