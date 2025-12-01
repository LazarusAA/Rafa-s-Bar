# 🧩 Rafa's Bar - Component Library

Production-ready React components built with **Next.js 14**, **Framer Motion**, and the **"Drunk-Proof UI"** philosophy.

---

## 📁 Structure

```
components/
├── customer/              # Mobile-first customer components
│   ├── DigitalMenu.tsx   # Main menu with cart + ordering
│   ├── GenreBattle.tsx   # Live music voting duel
│   ├── FlashPromo.tsx    # Animated FOMO banner
│   └── index.ts          # Barrel export
│
├── admin/                # Tablet-optimized staff components
│   ├── BartenderKDS.tsx  # Kitchen Display System
│   └── index.ts          # Barrel export
│
└── ui/                   # shadcn/ui base components
    ├── button.tsx
    ├── card.tsx
    └── ...
```

---

## 🎨 Customer Components

### `<DigitalMenu />`

**Purpose:** The main ordering interface for customers.

**Props:**
```tsx
interface DigitalMenuProps {
  items: MenuItem[]; // Array of menu items from Supabase
}
```

**Usage:**
```tsx
import { DigitalMenu } from '@/components/customer';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true);

  return <DigitalMenu items={items || []} />;
}
```

**Features:**
- ✅ Sticky horizontal category navigation
- ✅ One-tap item addition
- ✅ Floating "View Order" FAB with live total
- ✅ Cart modal with `+`/`-` quantity controls
- ✅ Full-screen success animation

**State Management:**
- Local state (no external store needed)
- Optimistic UI updates

**Accessibility:**
- `inputMode="numeric"` for table number
- `whileTap` feedback on all buttons
- High contrast colors (WCAG AAA)

---

### `<GenreBattle />`

**Purpose:** Real-time music voting visualizer.

**Props:** None (fetches active battle from Supabase)

**Usage:**
```tsx
import { GenreBattle } from '@/components/customer';

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto">
      <GenreBattle />
    </div>
  );
}
```

**Features:**
- ✅ Vertical "duel" bars (animated with Framer Motion)
- ✅ Real-time vote updates (Supabase Realtime)
- ✅ 2-second vote cooldown (prevent spam)
- ✅ Visual winner indicator (flame icon)

**Database Requirements:**
- Needs at least one `genre_battle` with `is_active = true`
- Uses RPC function `vote_for_genre(battle_id, choice)`

**Performance:**
- Single Realtime subscription
- Optimistic vote rendering

---

### `<FlashPromo />`

**Purpose:** Urgent FOMO banner for limited-time offers.

**Props:** None (fetches active promo from Supabase)

**Usage:**
```tsx
import { FlashPromo } from '@/components/customer';

export default function HomePage() {
  return (
    <main>
      <FlashPromo />
      {/* Rest of page */}
    </main>
  );
}
```

**Features:**
- ✅ Auto-show when promo is activated
- ✅ Animated entrance/exit
- ✅ Scrolling background pattern
- ✅ Flame + Zap icon animations

**Database Requirements:**
- Needs `flash_promos` table with `is_active` field
- Only shows when `is_active = true`

---

## 🛠️ Admin Components

### `<BartenderKDS />`

**Purpose:** Kitchen Display System for bartenders/kitchen staff.

**Props:** None (fetches pending orders from Supabase)

**Usage:**
```tsx
import { BartenderKDS } from '@/components/admin';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-rafa-base">
      <BartenderKDS />
    </div>
  );
}
```

**Features:**
- ✅ HUGE table numbers (7xl font, readable from 6 feet)
- ✅ Color-coded urgency system:
  - **< 5 min:** Cyan (normal)
  - **5-10 min:** Yellow (caution)
  - **> 10 min:** Red + pulse (critical)
- ✅ Real-time order updates
- ✅ Optimistic "Mark Delivered" action
- ✅ Responsive grid (1-4 columns)

**Urgency Logic:**
```tsx
const age = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
const isUrgent = age >= 5;
const isCritical = age >= 10;
```

**Database Requirements:**
- Joins `orders` with `order_items` and `menu_items`
- Only shows `status = 'pending'`

---

## 🎯 Design Principles Applied

### 1. **Thumb Zone Optimization**
All CTAs are placed in the bottom 40% of the screen:
```tsx
<div className="fixed bottom-6 left-4 right-4">
  {/* FAB here */}
</div>
```

### 2. **High Contrast**
No subtle grays. All text is either:
- `text-white` (primary)
- `text-zinc-400` (secondary minimum)
- `text-imperial` / `text-cyber-cyan` (accents)

### 3. **Instant Feedback**
Every button uses Framer Motion's `whileTap`:
```tsx
<motion.button whileTap={{ scale: 0.95 }}>
  Click Me
</motion.button>
```

### 4. **No Typing** (except table number)
All interactions are tap-based. Cart uses `+`/`-` buttons instead of text inputs.

---

## 🔌 Integration with Supabase

### Required Tables
```sql
-- menu_items (with RLS for public read)
-- orders (with RLS for anon insert, auth all)
-- order_items (with RLS for anon insert, auth all)
-- genre_battles (with RLS for anon read active)
-- flash_promos (with RLS for anon read active)
```

### Required RPC Functions
```sql
CREATE FUNCTION vote_for_genre(battle_id UUID, choice TEXT)
RETURNS VOID AS $$
BEGIN
  IF choice = 'a' THEN
    UPDATE genre_battles SET votes_a = votes_a + 1 WHERE id = battle_id;
  ELSIF choice = 'b' THEN
    UPDATE genre_battles SET votes_b = votes_b + 1 WHERE id = battle_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Realtime Setup
Enable Realtime on these tables:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE genre_battles;
ALTER PUBLICATION supabase_realtime ADD TABLE flash_promos;
```

---

## 🧪 Testing Checklist

### Customer View
- [ ] Categories scroll horizontally
- [ ] Adding item shows FAB immediately
- [ ] Cart modal shows correct quantities
- [ ] Table number input triggers numeric keyboard on mobile
- [ ] Success animation plays for 3 seconds
- [ ] Genre battle bars animate smoothly

### Admin View
- [ ] Orders appear in real-time
- [ ] Table numbers are huge and readable
- [ ] Urgency colors change at 5 min and 10 min marks
- [ ] "Mark Delivered" removes order immediately
- [ ] Empty state shows when no orders

---

## 🚀 Performance Tips

1. **Server Components First**
   - Fetch initial data in server components
   - Use `'use client'` only when needed (state, events, animations)

2. **Optimistic Updates**
   - Update UI immediately
   - Sync with DB in background
   - Example: `handleDeliver` in BartenderKDS

3. **Minimize Realtime Subscriptions**
   - One subscription per component (not per order/item)
   - Clean up channels in `useEffect` return

4. **Image Optimization** (Future)
   - Use Next.js `<Image />` component
   - Add `loading="lazy"`
   - Serve WebP with fallback

---

## 📦 Dependencies

```json
{
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.511.0",
  "@supabase/supabase-js": "^2.86.0",
  "tailwindcss": "4.1.7",
  "next": "15.4.0-canary.47"
}
```

---

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.ts`:
```ts
extend: {
  colors: {
    'imperial': '#YOUR_COLOR',
    'cyber-cyan': '#YOUR_COLOR',
  }
}
```

### Changing Urgency Thresholds
Edit `lib/design-tokens.ts`:
```ts
export const ORDER_URGENCY = {
  NORMAL_MAX_MINUTES: 5,   // Change this
  URGENT_MAX_MINUTES: 10,  // Change this
};
```

### Adding New Categories
Edit `lib/design-tokens.ts`:
```ts
export const MENU_CATEGORIES = [
  { id: 'beers', label: '🍺 BIRRAS', emoji: '🍺' },
  { id: 'new_category', label: '🥂 NEW', emoji: '🥂' }, // Add here
];
```

---

## 🐛 Troubleshooting

### "Component doesn't show real-time updates"
1. Check Realtime is enabled on Supabase table
2. Verify RLS policies allow anon/auth to read
3. Check browser console for Realtime errors

### "Buttons feel laggy"
1. Ensure `whileTap={{ scale: 0.95 }}` is present
2. Check for layout thrashing (avoid `getBoundingClientRect` in animations)
3. Use CSS `will-change` for heavy animations

### "Cart total is wrong"
1. Verify `price_at_time_of_order` matches `menu_item.price`
2. Check for floating-point errors (use integers for currency)

---

## 📞 Support

- **Docs:** See `DESIGN_SYSTEM.md` for full design philosophy
- **Types:** See `lib/types.ts` for TypeScript interfaces
- **Tokens:** See `lib/design-tokens.ts` for constants

**Last Updated:** December 1, 2025

