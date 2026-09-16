import { LightThemeMove } from "baseui";
import type { Theme } from "baseui";

/** Corps / UI — aligné sur uber.com (UberMoveText). */
const FONT_TEXT =
  'UberMoveText, UberMove, var(--font-inter), system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Titres / display — aligné sur uber.com (UberMove). */
const FONT_DISPLAY =
  'UberMove, UberMoveText, var(--font-inter), system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif';

function isDisplayKey(key: string) {
  return (
    key.startsWith("Display") ||
    key.startsWith("Heading") ||
    key.startsWith("MonoDisplay")
  );
}

const typography = Object.fromEntries(
  Object.entries(LightThemeMove.typography).map(([key, value]) => {
    if (value && typeof value === "object" && "fontFamily" in value) {
      return [
        key,
        {
          ...value,
          fontFamily: isDisplayKey(key) ? FONT_DISPLAY : FONT_TEXT,
        },
      ];
    }
    return [key, value];
  }),
) as Theme["typography"];

/** Thème officiel Base Web « Move », avec UberMove / UberMoveText. */
export const uberTheme: Theme = {
  ...LightThemeMove,
  typography,
};
