/**
 * RAFA'S BAR - DESIGN TOKENS
 * Centralized constants for the "Cyberpunk Chinchorro" design system
 */

export const COLORS = {
  // Brand Colors
  RAFA_BASE: '#09090b',
  RAFA_CARD: '#18181b',
  IMPERIAL: '#FACC15',
  CYBER_CYAN: '#22d3ee',
  CYBER_PINK: '#e879f9',
  DANGER: '#dc2626',
} as const;

export const SPACING = {
  // Touch Target Sizes (Drunk-Proof)
  TOUCH_MIN: '44px',
  TOUCH_COMFORTABLE: '52px',
  TOUCH_LARGE: '60px',
  
  // Layout Zones
  THUMB_ZONE_START: '60vh', // Bottom 40% of screen
  
  // Padding
  CONTAINER: '1rem',
  CARD: '1.5rem',
} as const;

export const TYPOGRAPHY = {
  // Font Sizes (Never below 16px for body text)
  HERO: '4.5rem', // 72px
  TITLE: '3rem',  // 48px
  HEADING: '2rem', // 32px
  SUBHEADING: '1.5rem', // 24px
  BODY: '1rem',   // 16px
  CAPTION: '0.875rem', // 14px
  
  // Font Weights (No light fonts!)
  BLACK: 900,
  BOLD: 700,
  MEDIUM: 600,
} as const;

export const ANIMATION = {
  // Durations
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SUCCESS: 3000,
  
  // Easing
  SPRING: { type: 'spring', stiffness: 200, damping: 20 },
  EASE_OUT: { type: 'tween', ease: 'easeOut' },
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY_NAV: 30,
  FAB: 40,
  MODAL: 50,
  SUCCESS_OVERLAY: 60,
} as const;

/**
 * Urgency thresholds for Bartender KDS
 */
export const ORDER_URGENCY = {
  NORMAL_MAX_MINUTES: 5,
  URGENT_MAX_MINUTES: 10,
  // > 10 minutes = CRITICAL
} as const;

/**
 * Category configuration for menu
 */
export const MENU_CATEGORIES = [
  { id: 'beers', label: '🍺 BIRRAS', emoji: '🍺' },
  { id: 'shots', label: '🥃 SHOTS', emoji: '🥃' },
  { id: 'cocktails', label: '🍹 COCTELES', emoji: '🍹' },
  { id: 'food', label: '🍔 FOOD', emoji: '🍔' },
  { id: 'non_alcoholic', label: '🥤 SIN ALCOHOL', emoji: '🥤' },
] as const;

/**
 * Validation: Minimum table number length
 */
export const VALIDATION = {
  TABLE_NUMBER_MIN_LENGTH: 1,
  TABLE_NUMBER_MAX_LENGTH: 10,
} as const;

