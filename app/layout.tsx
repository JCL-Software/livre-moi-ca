import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr-CA"
      suppressHydrationWarning
      className="h-full antialiased"
      style={
        {
          "--font-body":
            '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
          "--font-display":
            '"Trebuchet MS", "Avenir Next", "Segoe UI", sans-serif',
        } as CSSProperties
      }
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <RegisterServiceWorker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
