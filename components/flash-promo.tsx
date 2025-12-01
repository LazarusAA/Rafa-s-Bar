'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FlashPromo as FlashPromoType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

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
      .channel('flash_promos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flash_promos' }, (payload) => {
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
      })
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
          className="bg-red-600 text-white overflow-hidden"
        >
          <div className="p-3 flex items-center justify-center gap-2 text-center font-bold animate-pulse">
             <Flame className="fill-yellow-400 text-yellow-400" />
             <span>{promo.message_text}</span>
             <Flame className="fill-yellow-400 text-yellow-400" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

