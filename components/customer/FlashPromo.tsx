'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FlashPromo as FlashPromoType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

export function FlashPromo() {
  const [promo, setPromo] = useState<FlashPromoType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    const fetchPromo = async () => {
      const { data } = await supabase
        .from('flash_promos')
        .select('*')
        .eq('is_active', true)
        .single();
      if (data) setPromo(data);
    };
    fetchPromo();

    // Realtime subscription
    const channel = supabase
      .channel('flash_promos_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'flash_promos' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setPromo(null);
          } else {
            const newPromo = payload.new as FlashPromoType;
            if (newPromo.is_active) {
              setPromo(newPromo);
            } else {
              setPromo(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AnimatePresence>
      {promo && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-danger via-red-500 to-danger text-white overflow-hidden relative"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"
            />
          </div>

          <div className="relative p-4 flex items-center justify-center gap-3 text-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Flame className="fill-imperial text-imperial" size={28} />
            </motion.div>

            <p className="font-black text-lg sm:text-xl uppercase tracking-wide drop-shadow-lg">
              {promo.message_text}
            </p>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Zap className="fill-imperial text-imperial" size={28} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

