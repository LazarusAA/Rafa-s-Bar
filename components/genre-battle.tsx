'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GenreBattle as GenreBattleType } from '@/lib/types';
import { voteGenre } from '@/app/actions';
import { motion } from 'framer-motion';

export function GenreBattle() {
  const [battle, setBattle] = useState<GenreBattleType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    const fetchBattle = async () => {
      const { data } = await supabase
        .from('genre_battles')
        .select('*')
        .eq('is_active', true)
        .single();
      if (data) setBattle(data);
    };
    fetchBattle();

    // Realtime subscription
    const channel = supabase
      .channel('genre_battles')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'genre_battles' }, (payload) => {
        setBattle(payload.new as GenreBattleType);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!battle) return null; 

  const totalVotes = battle.votes_a + battle.votes_b;
  const percentA = totalVotes === 0 ? 50 : (battle.votes_a / totalVotes) * 100;

  return (
    <div className="w-full p-4 bg-rafa-card rounded-xl border border-zinc-800 my-4">
      <h2 className="text-center text-cyber-cyan font-bold mb-4 text-xl uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
        Music Battle
      </h2>
      <div className="flex justify-between mb-2 text-sm font-bold">
        <span className="text-cyber-pink">{battle.genre_a_name}</span>
        <span className="text-imperial">{battle.genre_b_name}</span>
      </div>
      
      <div className="relative h-12 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700">
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-cyber-pink"
          animate={{ width: `${percentA}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        <motion.div 
          className="absolute right-0 top-0 bottom-0 bg-imperial"
          animate={{ width: `${100 - percentA}%` }}
          transition={{ type: "spring", stiffness: 100 }}
        />
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black z-10 -translate-x-1/2" />
      </div>

      <div className="flex justify-between mt-4 gap-4">
        <button 
          onClick={() => voteGenre('a')}
          className="flex-1 py-3 bg-zinc-900 border border-cyber-pink/50 text-cyber-pink rounded-lg font-bold hover:bg-cyber-pink hover:text-black transition-colors"
        >
          VOTE A
        </button>
        <button 
          onClick={() => voteGenre('b')}
          className="flex-1 py-3 bg-zinc-900 border border-imperial/50 text-imperial rounded-lg font-bold hover:bg-imperial hover:text-black transition-colors"
        >
          VOTE B
        </button>
      </div>
    </div>
  );
}

