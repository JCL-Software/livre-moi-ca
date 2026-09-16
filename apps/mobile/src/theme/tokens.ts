import { MAP_PALETTE } from "@livre-moi/shared/geo";

/** Palette Uber / Base Web — worktree UX lab. */
export const colors = {
  background: "#ffffff",
  foreground: "#000000",
  muted: "#F3F3F3",
  mutedForeground: "#545454",
  border: "#E2E2E2",
  card: "#ffffff",
  primary: "#000000",
  primaryForeground: "#ffffff",
  inverse: "#000000",
  inverseForeground: "#ffffff",
  overlay: "rgba(0, 0, 0, 0.04)",
  success: "#0f7b3a",
  successMuted: "#edf8f1",
  danger: "#d44333",
  map: MAP_PALETTE.land,
  mapLine: "#000000",
  tabBar: "#ffffff",
  tabInactive: "#9b9b9b",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const type = {
  display: 32,
  title: 24,
  subtitle: 18,
  body: 16,
  caption: 14,
  micro: 11,
} as const;

export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
} as const;

export type FontWeight = keyof typeof fonts;
