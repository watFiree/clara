import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { isCloudMode } from "@/config";
import "./globals.css";

const fontSans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clara - Your Personal Wellbeing Assistant",
  description:
    "Clara is an open-source, privacy-first wellbeing assistant. Check in with yourself, reflect, and feel supported - on your terms.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Clara - Your Personal Wellbeing Assistant",
    description:
      "An open-source, privacy-first AI companion for daily check-ins, self-reflection, and emotional support.",
    siteName: "Clara",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clara - Your Personal Wellbeing Assistant",
    description:
      "An open-source, privacy-first AI companion for daily check-ins, self-reflection, and emotional support.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${geistMono.variable} antialiased`}
      >
        {isCloudMode ? <AuthKitProvider>{children}</AuthKitProvider> : children}
      </body>
    </html>
  );
}
