import { Text, type TextProps, type TextStyle } from "react-native";
import { colors, fonts, type, type FontWeight } from "@/theme/tokens";

type AppTextProps = TextProps & {
  variant?: "display" | "title" | "subtitle" | "body" | "caption" | "micro";
  weight?: FontWeight;
  color?: string;
  align?: TextStyle["textAlign"];
};

const SIZE: Record<NonNullable<AppTextProps["variant"]>, number> = {
  display: type.display,
  title: type.title,
  subtitle: type.subtitle,
  body: type.body,
  caption: type.caption,
  micro: type.micro,
};

export function AppText({
  variant = "body",
  weight = "regular",
  color = colors.foreground,
  align,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          color,
          fontFamily: fonts[weight],
          fontSize: SIZE[variant],
          letterSpacing: variant === "display" ? -0.6 : 0,
          lineHeight: Math.round(SIZE[variant] * 1.35),
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
