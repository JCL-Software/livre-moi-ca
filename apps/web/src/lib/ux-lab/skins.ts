export const UX_SKIN_STORAGE_KEY = "livre-moi-ux-skin-v2";

export const UX_SKINS = [
  {
    id: "baseweb",
    label: "Base Web · Uber",
    subtitle: "Design system Uber — baseweb.design",
    swatch: "#000000",
    repo: "https://baseweb.design/",
  },
  {
    id: "livre-moi",
    label: "Livre-moi",
    subtitle: "Identité actuelle — noir / blanc",
    swatch: "#111111",
    repo: null,
  },
  {
    id: "ryde",
    label: "Ryde",
    subtitle: "arushsingh03/uber-clone — bleu #0286FF",
    swatch: "#0286FF",
    repo: "https://github.com/arushsingh03/uber-clone",
  },
  {
    id: "indigo",
    label: "Indigo",
    subtitle: "Variation ride-hailing — #6366F1",
    swatch: "#6366F1",
    repo: "https://github.com/adarshvermaa/margwa",
  },
] as const;

export type UxSkinId = (typeof UX_SKINS)[number]["id"];

export const DEFAULT_UX_SKIN: UxSkinId = "baseweb";

export function isUxSkinId(value: string | null | undefined): value is UxSkinId {
  return UX_SKINS.some((skin) => skin.id === value);
}
