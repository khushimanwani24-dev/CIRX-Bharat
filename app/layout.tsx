import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReBharat | Closed-Loop Secondary Feedstock Exchange for Indian Industry",
  description:
    "Enterprise B2B industrial symbiosis platform for the Nashik manufacturing corridor. Circular byproduct matching, zero-leakage privacy, and CPCB Form 10 compliance.",
  keywords: [
    "Industrial Symbiosis",
    "Circular Economy India",
    "CPCB Form 10",
    "Hazardous Waste Exchange",
    "Secondary Feedstocks",
    "MIDC Ambad",
    "MIDC Satpur",
    "Maharashtra Industrial Development",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
