import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

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
  title: "ReBharat | Closed-Loop Secondary Feedstock Exchange for Gujarat MSMEs",
  description:
    "Enterprise B2B industrial symbiosis platform for the Ahmedabad manufacturing cluster (Vatva & Naroda GIDC). Closed-loop secondary feedstock exchange for Gujarat MSMEs, zero-leakage privacy, and GPCB XGN compliance.",
  keywords: [
    "Industrial Symbiosis",
    "Circular Economy Gujarat",
    "GPCB XGN Form 10",
    "Hazardous Waste Exchange",
    "Secondary Feedstocks",
    "Vatva GIDC",
    "Naroda GIDC",
    "Kathwada GIDC",
    "Gujarat Industrial Development Corporation",
    "Synthetic Gypsum",
    "Spent Acid",
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
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
