// src/ui/tokens/colors.ts
//
// GS25-inspired (not a brand clone) light theme tokens.
// Goal: 밝고 선명한 카드 UI + 쿨톤(블루/퍼플) 포인트.

export const colors = {
  // --- Semantic tokens (preferred) ---
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FF',

  text: '#111827',
  textMuted: '#6B7280',
  textSubtle: '#9CA3AF',

  border: '#E5E7EB',
  borderStrong: '#CBD5E1',

  // Accent (cool-tone)
  primary: '#2f00daff',
  primarySoft: '#EFEAFF',
  primaryPressed: '#2f00daff',

  secondary: '#00A3FF',
  secondarySoft: '#E6F6FF',

  // Status
  danger: '#E11D48',
  dangerSoft: '#FFF1F2',

  warning: '#F97316',
  warningSoft: '#FFF7ED',

  success: '#16A34A',
  successSoft: '#ECFDF5',

  // Cards by urgency
  expiredBg: '#FFF1F2',
  expiredBorder: '#FDA4AF',
  soonBg: '#FFF7ED',
  soonBorder: '#FDBA74',

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
