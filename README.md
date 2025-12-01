# 🍺 Rafa's Bar - "Cyberpunk Chinchorro" Web App

A high-volume bar ordering system designed for **drunk users in dark environments**. Built with Next.js 14, Supabase, and the "Drunk-Proof UI" philosophy.

![Design System](https://img.shields.io/badge/Design-Drunk--Proof%20UI-yellow?style=for-the-badge)
![Framework](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![Database](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Styling](https://img.shields.io/badge/Tailwind-4.1.7-cyan?style=for-the-badge&logo=tailwindcss)

---

## 🎯 The Problem

Traditional restaurant apps fail in **high-stress, low-light environments** (nightclubs, bars, late-night food spots) because:

- ❌ Subtle colors are invisible in darkness
- ❌ Small buttons are impossible to tap when drunk
- ❌ Complex flows require too much cognitive load
- ❌ Typing is error-prone with impaired motor skills

---

## 💡 The Solution: "Drunk-Proof UI"

### Design Principles

1. **Thumb Zone Only** - All primary actions in bottom 40% of screen
2. **High Contrast** - No subtle grays. Stark whites on deep black.
3. **Instant Feedback** - Every tap has visual/haptic response
4. **No Typing** - Minimize text input (only table number required)
5. **HUGE Targets** - Minimum 44px touch targets, 60px preferred

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL + Realtime)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

```bash
# Using Supabase CLI
supabase db push

# Or run supabase/schema.sql in Supabase Dashboard
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open in Browser

- **Customer View:** `http://localhost:3000`
- **Bartender KDS:** `http://localhost:3000/admin`
- **Showcase:** `http://localhost:3000/showcase`

---

## 📱 Features

### Customer Experience

#### 🍻 Digital Menu
- Horizontal-scroll category navigation (Beers, Shots, Food, etc.)
- One-tap item addition
- Floating "View Order" button with live total
- Cart modal with +/- quantity controls
- Full-screen success animation

#### 🎵 Genre Battle
- Real-time music voting duel
- Vertical progress bars that "fight"
- Live updates across all devices
- Vote cooldown to prevent spam

#### 🔥 Flash Promos
- FOMO-inducing limited-time offers
- Auto-show/hide based on database state
- Animated entrance/exit

### Staff Experience

#### 📊 Bartender KDS (Kitchen Display System)
- **HUGE** table numbers (readable from 6 feet away)
- Color-coded urgency system:
  - **Cyan:** Normal (< 5 min)
  - **Yellow:** Caution (5-10 min)
  - **Red + Pulse:** Critical (> 10 min)
- Real-time order updates
- One-tap "Mark Delivered"

---

## 📂 Project Structure

```
Rafa-s-Bar/
├── app/
│   ├── page.tsx              # Customer homepage
│   ├── admin/page.tsx        # Bartender KDS
│   ├── showcase/page.tsx     # Component showcase
│   └── globals.css           # Design system styles
│
├── components/
│   ├── customer/             # Mobile-optimized components
│   │   ├── DigitalMenu.tsx
│   │   ├── GenreBattle.tsx
│   │   └── FlashPromo.tsx
│   ├── admin/                # Tablet-optimized components
│   │   └── BartenderKDS.tsx
│   └── ui/                   # shadcn/ui base components
│
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── design-tokens.ts      # Design constants
│   └── supabase/             # Supabase client setup
│
├── supabase/
│   └── schema.sql            # Database schema + RLS
│
├── tailwind.config.ts        # Custom theme
├── DESIGN_SYSTEM.md          # Full design philosophy
├── IMPLEMENTATION_GUIDE.md   # Step-by-step setup
└── components/README.md      # Component API docs
```

---

## 🎨 Design System Highlights

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Rafa Base** | `#09090b` | Main background (zinc-950) |
| **Rafa Card** | `#18181b` | Card surfaces (zinc-900) |
| **Imperial** | `#FACC15` | Primary CTA (yellow-400) |
| **Cyber Cyan** | `#22d3ee` | Secondary accent (cyan-400) |
| **Cyber Pink** | `#e879f9` | Decorative (fuchsia-400) |
| **Danger** | `#dc2626` | Destructive actions (red-600) |

### Typography Scale

- **Hero:** 72px (Bartender KDS table numbers)
- **Title:** 48px (Page headers)
- **Heading:** 32px (Section titles)
- **Subheading:** 24px (Item names)
- **Body:** 16px (Descriptions - **MINIMUM**)
- **Caption:** 14px (Timestamps)

**Rule:** Never use `font-normal` or `font-light`. Minimum is `font-bold`.

---

## 🗄️ Database Schema

### Tables

- **`menu_items`** - Products (beers, food, shots, etc.)
- **`orders`** - Customer orders
- **`order_items`** - Junction table (order ↔ menu items)
- **`genre_battles`** - Music voting battles
- **`flash_promos`** - Limited-time offer banners

### RPC Functions

- **`vote_for_genre(battle_id, choice)`** - Secure voting

### Realtime Enabled

- ✅ `orders` (for instant bartender updates)
- ✅ `genre_battles` (for live vote syncing)
- ✅ `flash_promos` (for banner show/hide)

See `supabase/schema.sql` for full schema with RLS policies.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Full UX philosophy, "Golden Rules", and design decisions |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Step-by-step setup, testing, and deployment |
| [components/README.md](./components/README.md) | Component API, props, and usage examples |
| [lib/design-tokens.ts](./lib/design-tokens.ts) | Design constants (colors, spacing, animations) |

---

## 🧪 Testing

### Manual Testing Scenarios

1. **The Drunk User Test**
   - Reduce screen brightness to 30%
   - Use one hand only
   - Try to order 3 items in < 30 seconds

2. **The Busy Bartender Test**
   - Stand 6 feet from tablet
   - Can you read all table numbers?
   - Can you acknowledge 5 orders in < 10 seconds?

3. **The Real-Time Test**
   - Open customer view on 2 devices
   - Vote in Genre Battle
   - Both screens update in < 1 second?

---

## 🚀 Deployment

### Recommended Platforms

- **Frontend:** Vercel (zero-config Next.js hosting)
- **Database:** Supabase (managed PostgreSQL + Realtime)
- **Images:** Cloudinary or Supabase Storage

### Environment Variables (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### Pre-Deploy Checklist

- [ ] Run `npm run build` (check for errors)
- [ ] Test on real mobile devices (iOS + Android)
- [ ] Verify Realtime subscriptions work
- [ ] Check Lighthouse accessibility score (aim for 90+)
- [ ] Test in low-light environment

---

## 🎯 Key Metrics

### UX Goals

- **Order Completion Time:** < 30 seconds
- **Cart Abandonment Rate:** < 10%
- **Genre Battle Engagement:** > 50% of users vote
- **Bartender Response Time:** < 5 minutes average

### Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **Realtime Latency:** < 500ms
- **Mobile FPS:** 60 FPS (scrolling/animations)

---

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

### Database Commands

```bash
# Push schema changes
supabase db push

# Reset database (WARNING: deletes data)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > lib/database.types.ts
```

---

## 🤝 Contributing

### Design Philosophy

All contributions must follow the **"Drunk-Proof UI"** principles:

1. High contrast (no subtle colors)
2. Large touch targets (min 44px)
3. Minimal typing
4. Instant feedback

### Code Style

- Use TypeScript (strict mode)
- Follow existing component patterns
- Add Framer Motion animations to all interactive elements
- Test on real mobile devices

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

## 🙏 Credits

### Design Inspiration

- **Cyberpunk 2077** (neon aesthetic)
- **Stock Trading Apps** (urgency/clarity)
- **Emergency Response UIs** (high-stakes readability)

### Tech Credits

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

For questions or issues:

1. Read `DESIGN_SYSTEM.md` (design decisions)
2. Read `IMPLEMENTATION_GUIDE.md` (setup help)
3. Check `components/README.md` (component API)
4. Review `lib/types.ts` (TypeScript interfaces)

---

## 🎉 The Golden Rules

> **"If it's not in the thumb zone, it's not critical."**  
> **"If it's not high contrast, it's invisible."**  
> **"If it's not animated, it feels broken."**  
> **"If it requires typing, it's too complex."**  
> **"If the bartender has to squint, the font is too small."**

---

**Built with ❤️ for high-volume bars in Costa Rica.**  
**¡Pura Vida! 🇨🇷🍻**
