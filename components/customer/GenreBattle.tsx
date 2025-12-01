'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GenreBattle as GenreBattleType } from '@/lib/types';
import { voteGenre } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Music, Zap } from 'lucide-react';

export function GenreBattle() {
  const [battle, setBattle] = useState<GenreBattleType | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
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

    // Realtime subscription for live updates
    const channel = supabase
      .channel('genre_battles_realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'genre_battles' },
        (payload) => {
          setBattle(payload.new as GenreBattleType);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!battle) return null;

  const totalVotes = battle.votes_a + battle.votes_b || 1; // Avoid division by zero
  const percentA = (battle.votes_a / totalVotes) * 100;
  const percentB = (battle.votes_b / totalVotes) * 100;

  const handleVote = async (choice: 'a' | 'b') => {
    await voteGenre(choice);
    setHasVoted(true);
    setTimeout(() => setHasVoted(false), 2000);
  };

  const winner = battle.votes_a > battle.votes_b ? 'a' : battle.votes_b > battle.votes_a ? 'b' : 'tie';

  return (
    <div className="w-full bg-gradient-to-br from-rafa-card to-zinc-900 rounded-3xl border-2 border-zinc-800 p-6 my-6 relative overflow-hidden shadow-2xl">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      {/* Header */}
      <div className="relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <Flame className="text-danger" size={28} />
          <h2 className="text-center text-cyber-cyan font-black text-2xl uppercase tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            Music Battle
          </h2>
          <Zap className="text-imperial" size={28} />
        </motion.div>

        {/* Genre Names */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <Music className="text-cyber-pink" size={20} />
              <p className="text-cyber-pink font-black text-lg sm:text-xl drop-shadow-[0_0_5px_rgba(232,121,249,0.6)]">
                {battle.genre_a_name}
              </p>
            </div>
            <p className="text-4xl sm:text-5xl font-black text-white mt-1">
              {battle.votes_a}
            </p>
          </div>

          <div className="text-zinc-500 font-black text-3xl">VS</div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <p className="text-imperial font-black text-lg sm:text-xl drop-shadow-[0_0_5px_rgba(250,204,21,0.6)]">
                {battle.genre_b_name}
              </p>
              <Music className="text-imperial" size={20} />
            </div>
            <p className="text-4xl sm:text-5xl font-black text-white mt-1">
              {battle.votes_b}
            </p>
          </div>
        </div>

        {/* VERTICAL DUEL BARS (The "Fight" Visualization) */}
        <div className="flex gap-4 mb-6 h-64">
          {/* Genre A Bar */}
          <div className="flex-1 relative bg-zinc-900 rounded-2xl overflow-hidden border-2 border-cyber-pink/30">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyber-pink to-fuchsia-400"
              initial={{ height: 0 }}
              animate={{ height: `${percentA}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {winner === 'a' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2"
                >
                  <Flame className="text-white drop-shadow-lg" size={32} />
                </motion.div>
              )}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-2xl drop-shadow-lg">
              {Math.round(percentA)}%
            </div>
          </div>

          {/* Genre B Bar */}
          <div className="flex-1 relative bg-zinc-900 rounded-2xl overflow-hidden border-2 border-imperial/30">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-imperial to-yellow-300"
              initial={{ height: 0 }}
              animate={{ height: `${percentB}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {winner === 'b' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2"
                >
                  <Flame className="text-black drop-shadow-lg" size={32} />
                </motion.div>
              )}
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-2xl drop-shadow-lg">
              {Math.round(percentB)}%
            </div>
          </div>
        </div>

        {/* Vote Buttons (BIG - Thumb Zone Optimized) */}
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('a')}
            disabled={hasVoted}
            className="flex-1 py-5 bg-cyber-pink/20 border-2 border-cyber-pink text-cyber-pink rounded-2xl font-black text-lg uppercase hover:bg-cyber-pink hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyber-pink/20"
          >
            {hasVoted ? '✓' : 'VOTE'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('b')}
            disabled={hasVoted}
            className="flex-1 py-5 bg-imperial/20 border-2 border-imperial text-imperial rounded-2xl font-black text-lg uppercase hover:bg-imperial hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-imperial/20"
          >
            {hasVoted ? '✓' : 'VOTE'}
          </motion.button>
        </div>

        {/* Vote Feedback */}
        <AnimatePresence>
          {hasVoted && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-green-400 font-bold mt-4"
            >
              ¡Voto registrado! 🔥
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

