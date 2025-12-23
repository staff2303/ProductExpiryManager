// src/ui/tokens/colors.ts
//
// GS25-inspired (not a brand clone) light theme tokens.
// Goal: 밝고 선명한 카드 UI + 쿨톤(블루/퍼플) 포인트.

export const colors = {
  // --- GS25 inspired brand accents (3-color system) ---
  // used as base UI accents (buttons, focus states, highlights)
  gsBlue: '#0B5FFF',
  gsDeepBlue: '#0A4BD6',
  gsMint: '#00C2C7',

  // --- Semantic tokens (preferred) ---
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FF',

  text: '#111827',
  textMuted: '#6B7280',
  textSubtle: '#9CA3AF',

  border: '#E5E7EB',
  borderStrong: '#CBD5E1',

  // Accent (GS base)
  primary: '#0B5FFF',
  primarySoft: '#E8F1FF',
  primaryPressed: '#0A4BD6',

  secondary: '#00C2C7',
  secondarySoft: '#E6FFFD',

  // Status
  danger: '#E03131',
  dangerSoft: '#FDE2E2',

  warning: '#F08C00',
  warningSoft: '#FFF4E6',

  success: '#0CA678',
  successSoft: '#E6FCF5',

  // Cards by urgency (textless = color-first)
  // Expired: stronger red, Today(D-Day): lighter red
  expiredBg: '#FDE2E2',
  expiredBorder: '#E03131',
  todayBg: '#FFE8E8',
  todayBorder: '#FA5252',
  soonBg: '#FFF4E6',
  soonBorder: '#F08C00',
  warnBg: '#E8F1FF',
  warnBorder: '#0B5FFF',
  okBg: '#E6FCF5',
  okBorder: '#0CA678',

  // --- Legacy keys (kept for compatibility) ---
  black: '#000000',
  white: '#FFFFFF',

  // Grays (light palette)
  gray0F: '#FFFFFF',
  gray111: '#F6F7FB',
  gray15: '#F3F4F6',
  gray17: '#F9FAFB',
  gray1B: '#EEF2FF',
  gray1D: '#E5E7EB',
  gray22: '#E5E7EB',
  gray23: '#D1D5DB',
  gray2B: '#CBD5E1',
  gray333: '#9CA3AF',
  gray3A: '#9CA3AF',
  gray444: '#6B7280',

  // Text/placeholder legacy
  grayAAA: '#6B7280',
  grayBD: '#4B5563',
  grayCF: '#374151',
  grayD0: '#374151',
  grayDDD: '#111827',
  gray666: '#6B7280',
  gray888: '#6B7280',

  invalid: '#B91C1C',
} as const;
