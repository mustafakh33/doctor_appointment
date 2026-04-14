import { Inter, Cairo, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "./_components/ScrollToTop";
import { Providers } from "./providers";
import RoleAccessGate from "./_components/RoleAccessGate";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

export const metadata = {
  title: {
    default: "Shifaa | Doctor Appointment Booking",
    template: "%s | Shifaa",
  },
  description:
    "Book appointments, explore specialists, and manage your healthcare journey with Shifaa.",
  keywords: [
    "doctor appointment",
    "healthcare booking",
    "medical specialists",
    "online booking",
  ],
  icons: {
    icon: "/assets/img/favicon.png",
    shortcut: "/assets/img/favicon.png",
    apple: "/assets/img/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${cairo.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Providers>
          <RoleAccessGate>{children}</RoleAccessGate>
          <ScrollToTop />
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: { fontFamily: "inherit" },
              duration: 3000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

