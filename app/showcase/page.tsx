/**
 * SHOWCASE PAGE - Design System Component Library
 * 
 * This page demonstrates all components in the "Drunk-Proof UI" system.
 * Use this for development, testing, and client presentations.
 */

import { createClient } from '@/lib/supabase/server';
import { DigitalMenu, GenreBattle, FlashPromo } from '@/components/customer';

export default async function ShowcasePage() {
  const supabase = await createClient();
  
  // Fetch sample data
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true);

  return (
    <div className="min-h-screen bg-rafa-base">
      {/* Header */}
      <header className="bg-gradient-to-r from-rafa-card to-zinc-900 border-b-2 border-imperial/30 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">
            Rafa's <span className="text-imperial">Bar</span>
          </h1>
          <p className="text-zinc-400 text-lg font-bold mt-2">
            "Cyberpunk Chinchorro" Design System Showcase
          </p>
        </div>
      </header>

      {/* Component Showcase */}
      <main className="max-w-6xl mx-auto p-6 space-y-12">
        
        {/* Section 1: Flash Promo */}
        <section>
          <div className="mb-4">
            <h2 className="text-3xl font-black text-white uppercase">
              1. Flash Promo Banner
            </h2>
            <p className="text-zinc-400 mt-2">
              The FOMO component. Animates in/out based on database state.
            </p>
          </div>
          <div className="bg-zinc-900 rounded-2xl overflow-hidden border-2 border-zinc-800">
            <FlashPromo />
            <div className="p-6 text-zinc-500 text-sm font-mono">
              {`<FlashPromo /> - Controlled by 'flash_promos.is_active'`}
            </div>
          </div>
        </section>

        {/* Section 2: Genre Battle */}
        <section>
          <div className="mb-4">
            <h2 className="text-3xl font-black text-white uppercase">
              2. Genre Battle (Music Voting)
            </h2>
            <p className="text-zinc-400 mt-2">
              Real-time duel visualizer. Updates instantly across all clients.
            </p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-6 border-2 border-zinc-800">
            <GenreBattle />
          </div>
        </section>

        {/* Section 3: Digital Menu */}
        <section>
          <div className="mb-4">
            <h2 className="text-3xl font-black text-white uppercase">
              3. Digital Menu (The Core Experience)
            </h2>
            <p className="text-zinc-400 mt-2">
              Mobile-first ordering interface. Categories, cart, and checkout.
            </p>
          </div>
          <div className="max-w-md mx-auto bg-zinc-900 rounded-2xl overflow-hidden border-2 border-zinc-800">
            <DigitalMenu items={items || []} />
          </div>
        </section>

        {/* Design Tokens Display */}
        <section>
          <div className="mb-4">
            <h2 className="text-3xl font-black text-white uppercase">
              4. Design Tokens
            </h2>
            <p className="text-zinc-400 mt-2">
              Color palette and typography scale.
            </p>
          </div>

          {/* Colors */}
          <div className="bg-zinc-900 rounded-2xl p-6 border-2 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-rafa-base rounded-lg border-2 border-zinc-700"></div>
                <p className="text-sm font-mono text-zinc-400">rafa-base</p>
                <p className="text-xs font-mono text-zinc-600">#09090b</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-rafa-card rounded-lg border-2 border-zinc-700"></div>
                <p className="text-sm font-mono text-zinc-400">rafa-card</p>
                <p className="text-xs font-mono text-zinc-600">#18181b</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-imperial rounded-lg border-2 border-yellow-300"></div>
                <p className="text-sm font-mono text-zinc-400">imperial</p>
                <p className="text-xs font-mono text-zinc-600">#FACC15</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-cyber-cyan rounded-lg border-2 border-cyan-300"></div>
                <p className="text-sm font-mono text-zinc-400">cyber-cyan</p>
                <p className="text-xs font-mono text-zinc-600">#22d3ee</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-cyber-pink rounded-lg border-2 border-fuchsia-300"></div>
                <p className="text-sm font-mono text-zinc-400">cyber-pink</p>
                <p className="text-xs font-mono text-zinc-600">#e879f9</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-danger rounded-lg border-2 border-red-500"></div>
                <p className="text-sm font-mono text-zinc-400">danger</p>
                <p className="text-xs font-mono text-zinc-600">#dc2626</p>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-zinc-900 rounded-2xl p-6 border-2 border-zinc-800 mt-4">
            <h3 className="text-xl font-bold text-white mb-4">Typography</h3>
            <div className="space-y-4">
              <div>
                <p className="text-7xl font-black text-white">Hero Text</p>
                <p className="text-sm font-mono text-zinc-500 mt-2">
                  text-7xl font-black (Bartender KDS Table Numbers)
                </p>
              </div>
              <div>
                <p className="text-5xl font-black text-white">Page Title</p>
                <p className="text-sm font-mono text-zinc-500 mt-2">
                  text-5xl font-black (Dashboard Headers)
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">Section Header</p>
                <p className="text-sm font-mono text-zinc-500 mt-2">
                  text-3xl font-black (Modal Titles)
                </p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">Item Name</p>
                <p className="text-sm font-mono text-zinc-500 mt-2">
                  text-xl font-bold (Menu Items)
                </p>
              </div>
              <div>
                <p className="text-base font-bold text-white">Body Text</p>
                <p className="text-sm font-mono text-zinc-500 mt-2">
                  text-base font-bold (Descriptions - 16px minimum)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Examples */}
        <section className="pb-12">
          <div className="mb-4">
            <h2 className="text-3xl font-black text-white uppercase">
              5. Animation Patterns
            </h2>
            <p className="text-zinc-400 mt-2">
              Framer Motion examples used throughout the system.
            </p>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-6 border-2 border-zinc-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm font-mono text-zinc-400">Tap Feedback:</p>
                <button className="bg-imperial text-black font-black py-3 px-6 rounded-xl active:scale-95 transition-transform">
                  TAP ME
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-mono text-zinc-400">Pulse Glow:</p>
                <div className="bg-imperial text-black font-black py-3 px-6 rounded-xl text-center animate-pulse-glow">
                  URGENT ORDER
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-rafa-card border-t-2 border-zinc-800 p-6 text-center">
        <p className="text-zinc-500 font-mono text-sm">
          "Drunk-Proof UI" Design System - Built with Next.js 14, Framer Motion, and Tailwind CSS 4
        </p>
        <p className="text-zinc-600 text-xs mt-2">
          Read DESIGN_SYSTEM.md for full documentation
        </p>
      </footer>
    </div>
  );
}

