'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, X, CheckCircle } from 'lucide-react';
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

  const categories = ['beers', 'cocktails', 'shots', 'food', 'non_alcoholic'];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  const handleOrder = async () => {
    if (!tableNumber) {
        alert('Por favor ingresa tu número de mesa');
        return;
    }
    const orderItems = cart.map(c => ({ id: c.item.id, quantity: c.quantity, price: c.item.price }));
    const res = await submitOrder(orderItems, tableNumber);
    if (res.success) {
      setIsOrderOpen(false);
      setCart([]);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
        alert('Error al enviar orden');
    }
  };

  const filteredItems = items.filter(i => i.category === activeCategory);

  return (
    <div className="pb-24">
       {/* Categories Header */}
       <div className="sticky top-0 z-10 bg-rafa-base/95 backdrop-blur-sm border-b border-zinc-800 py-4 overflow-x-auto flex gap-2 px-4 scrollbar-hide">
         {categories.map(cat => (
           <button
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-4 py-2 rounded-full text-sm font-bold uppercase whitespace-nowrap transition-colors ${
               activeCategory === cat 
                 ? 'bg-imperial text-black' 
                 : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
             }`}
           >
             {cat.replace('_', ' ')}
           </button>
         ))}
       </div>

       {/* Items Grid */}
       <div className="p-4 grid grid-cols-1 gap-4">
         {filteredItems.map(item => (
           <div key={item.id} className="bg-rafa-card rounded-xl overflow-hidden border border-zinc-800 flex">
             {item.image_url && (
               <div className="w-32 h-32 bg-zinc-800 flex-shrink-0">
                 <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
               </div>
             )}
             <div className="p-4 flex flex-col justify-between flex-grow">
               <div>
                 <h3 className="font-bold text-lg text-white">{item.name}</h3>
                 <p className="text-zinc-400 text-sm line-clamp-2">{item.description}</p>
               </div>
               <div className="flex justify-between items-center mt-2">
                 <span className="text-imperial font-bold">₡{item.price}</span>
                 <button 
                   onClick={() => addToCart(item)}
                   className="p-2 bg-zinc-800 rounded-full text-cyber-cyan hover:bg-zinc-700"
                 >
                   <Plus size={20} />
                 </button>
               </div>
             </div>
           </div>
         ))}
         {filteredItems.length === 0 && (
             <p className="text-center text-zinc-500 py-8">No hay items en esta categoría.</p>
         )}
       </div>

       {/* FAB */}
       <AnimatePresence>
         {cart.length > 0 && (
           <motion.div 
             initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
             className="fixed bottom-6 left-4 right-4 z-20"
           >
             <button 
               onClick={() => setIsOrderOpen(true)}
               className="w-full bg-imperial text-black font-bold py-4 rounded-xl shadow-lg shadow-imperial/20 flex justify-between px-6 items-center"
             >
               <span>Ver Orden ({cart.reduce((a,c) => a + c.quantity, 0)})</span>
               <span>₡{total}</span>
             </button>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Order Modal */}
       {isOrderOpen && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
           <motion.div 
             initial={{ y: "100%" }} animate={{ y: 0 }}
             className="bg-rafa-card w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 border-t sm:border border-zinc-800 max-h-[90vh] overflow-y-auto"
           >
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-white">Tu Orden</h2>
               <button onClick={() => setIsOrderOpen(false)} className="text-zinc-400"><X /></button>
             </div>

             <div className="space-y-4 mb-6">
               {cart.map((line, i) => (
                 <div key={i} className="flex justify-between items-center text-zinc-300">
                    <span>{line.quantity}x {line.item.name}</span>
                    <span>₡{line.item.price * line.quantity}</span>
                 </div>
               ))}
               <div className="border-t border-zinc-800 pt-4 flex justify-between text-xl font-bold text-imperial">
                 <span>Total</span>
                 <span>₡{total}</span>
               </div>
             </div>

             <div className="mb-6">
                <label className="block text-sm text-zinc-400 mb-2">Número de Mesa</label>
                <input 
                  type="text" 
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-imperial outline-none"
                  placeholder="Ej: 5"
                />
             </div>

             <button 
               onClick={handleOrder}
               className="w-full bg-cyber-cyan text-black font-bold py-4 rounded-xl hover:bg-cyan-300 transition-colors"
             >
               ENVIAR ORDEN
             </button>
           </motion.div>
         </div>
       )}

       {/* Success Overlay */}
       <AnimatePresence>
         {isSuccess && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center text-center p-4"
           >
             <motion.div 
               initial={{ scale: 0.5 }} animate={{ scale: 1 }} 
               className="text-green-500 mb-4"
             >
               <CheckCircle size={80} />
             </motion.div>
             <h2 className="text-3xl font-bold text-white mb-2">¡Orden Enviada!</h2>
             <p className="text-zinc-400">Las birras van en camino 🍻</p>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

