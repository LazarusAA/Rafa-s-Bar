import { createClient } from '@/lib/supabase/server';
import { DigitalMenu } from '@/components/digital-menu';
import { GenreBattle } from '@/components/genre-battle';
import { FlashPromo } from '@/components/flash-promo';

export default async function Home() {
  const supabase = await createClient();
  const { data: items } = await supabase.from('menu_items').select('*').eq('is_available', true);

  return (
    <main className="min-h-screen bg-rafa-base text-white">
      <FlashPromo />
      <header className="p-4 flex justify-center border-b border-zinc-800">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          RAFA'S <span className="text-imperial">BAR</span>
        </h1>
      </header>
      
      <div className="max-w-md mx-auto">
        <GenreBattle />
        <DigitalMenu items={items || []} />
      </div>
    </main>
  );
}
