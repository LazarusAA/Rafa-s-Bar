import { BartenderKDS } from '@/components/bartender-kds';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-rafa-base text-white">
       <header className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
         <h1 className="text-xl font-bold text-white">KITCHEN DISPLAY SYSTEM</h1>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-500 font-mono">LIVE</span>
         </div>
       </header>
       <BartenderKDS />
    </div>
  );
}

