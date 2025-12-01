'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckCircle, Minus } from 'lucide-react';
import { submitOrder } from '@/app/actions';

interface DigitalMenuProps {
  items: MenuItem[];
}

export function DigitalMenu({ items }: DigitalMenuProps) {
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('beers');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tableNumber, setTableNumber] = useState('');

  const categories = [
    { id: 'beers', label: '🍺 BIRRAS', emoji: '🍺' },
    { id: 'shots', label: '🥃 SHOTS', emoji: '🥃' },
    { id: 'cocktails', label: '🍹 COCTELES', emoji: '🍹' },
    { id: 'food', label: '🍔 FOOD', emoji: '🍔' },
    { id: 'non_alcoholic', label: '🥤 SIN ALCOHOL', emoji: '🥤' },
  ];

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.item.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.item.id !== itemId);
    });
  };

  const total = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  const handleOrder = async () => {
    if (!tableNumber) {
      // Visual shake feedback instead of alert
      return;
    }
    const orderItems = cart.map((c) => ({
      id: c.item.id,
      quantity: c.quantity,
      price: c.item.price,
    }));
    const res = await submitOrder(orderItems, tableNumber);
    if (res.success) {
      setIsOrderOpen(false);
      setCart([]);
      setTableNumber('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  const filteredItems = items.filter((i) => i.category === activeCategory && i.is_available);

  return (
    <div className="min-h-screen bg-rafa-base pb-32">
      {/* STICKY CATEGORY NAV - Horizontal Scroll */}
      <div className="sticky top-0 z-30 bg-rafa-base/95 backdrop-blur-md border-b-2 border-zinc-800 shadow-lg">
        <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              whileTap={{ scale: 0.95 }}
              className={`
                flex-shrink-0 snap-start px-6 py-3 rounded-full font-black text-sm uppercase tracking-wide
                transition-all duration-200 whitespace-nowrap border-2
                ${
                  activeCategory === cat.id
                    ? 'bg-imperial text-black border-imperial shadow-[0_0_20px_rgba(250,204,21,0.6)] scale-105'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600'
                }
              `}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* MENU ITEMS GRID */}
      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-rafa-card rounded-2xl overflow-hidden border-2 border-zinc-800 flex hover:border-zinc-700 transition-colors active:scale-[0.98]"
            >
              {/* Image on Left */}
              {item.image_url && (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-zinc-800 flex-shrink-0 relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content on Right */}
              <div className="flex-grow p-4 flex flex-col justify-between min-h-[112px]">
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-white leading-tight">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-imperial font-black text-xl sm:text-2xl">
                    ₡{item.price.toLocaleString()}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(item)}
                    className="p-3 bg-imperial text-black rounded-full hover:bg-yellow-300 active:bg-yellow-500 shadow-lg transition-colors"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg font-bold">
              No hay items disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* FLOATING "VIEW TAB" BUTTON - Bottom Right (Thumb Zone) */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-40"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOrderOpen(true)}
              className="w-full bg-imperial text-black font-black py-5 px-6 rounded-2xl shadow-2xl shadow-imperial/40 flex justify-between items-center border-2 border-yellow-300 hover:bg-yellow-300 transition-colors"
            >
              <span className="text-lg">
                VER ORDEN ({cart.reduce((a, c) => a + c.quantity, 0)})
              </span>
              <span className="text-2xl">₡{total.toLocaleString()}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORDER MODAL (FULL SCREEN ON MOBILE) */}
      <AnimatePresence>
        {isOrderOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setIsOrderOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-rafa-card w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl border-t-4 sm:border-4 border-imperial max-h-[95vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-rafa-card border-b-2 border-zinc-800 p-6 flex justify-between items-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Tu Orden
                </h2>
                <button
                  onClick={() => setIsOrderOpen(false)}
                  className="text-zinc-400 hover:text-white p-2"
                >
                  <X size={28} strokeWidth={3} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="p-6 space-y-4">
                {cart.map((line) => (
                  <div
                    key={line.item.id}
                    className="flex items-center justify-between bg-zinc-900 rounded-xl p-4 border border-zinc-800"
                  >
                    <div className="flex-grow">
                      <p className="font-bold text-white text-lg">{line.item.name}</p>
                      <p className="text-zinc-400 text-sm">
                        ₡{line.item.price.toLocaleString()} c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(line.item.id)}
                        className="p-2 bg-zinc-800 rounded-lg text-danger hover:bg-danger hover:text-white transition-colors"
                      >
                        <Minus size={18} strokeWidth={3} />
                      </motion.button>

                      <span className="font-black text-2xl text-imperial min-w-[3ch] text-center">
                        {line.quantity}
                      </span>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(line.item)}
                        className="p-2 bg-zinc-800 rounded-lg text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-colors"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </motion.button>

                      <span className="font-bold text-white text-lg min-w-[6ch] text-right">
                        ₡{(line.item.price * line.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="border-t-2 border-zinc-800 pt-4 flex justify-between items-center">
                  <span className="text-2xl font-black text-white uppercase">Total</span>
                  <span className="text-4xl font-black text-imperial">
                    ₡{total.toLocaleString()}
                  </span>
                </div>

                {/* Table Number Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wide">
                    Número de Mesa
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4 text-white text-2xl font-bold text-center focus:border-imperial outline-none transition-colors"
                    placeholder="5"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOrder}
                  disabled={!tableNumber}
                  className="w-full bg-cyber-cyan text-black font-black py-5 rounded-xl text-xl uppercase tracking-wide hover:bg-cyan-300 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors shadow-lg shadow-cyber-cyan/30 border-2 border-cyan-300"
                >
                  🚀 ENVIAR ORDEN
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS OVERLAY - "The Sent Animation" */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center text-center p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-green-500 mb-6"
            >
              <CheckCircle size={120} strokeWidth={2} />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-white mb-4 uppercase drop-shadow-lg"
            >
              ¡Enviado!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-imperial font-bold"
            >
              Las birras van en camino 🍻
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

