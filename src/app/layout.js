import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "../context/authContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FixMate | Smart Repair Service Platform",
  description:
    "Find trusted technicians and book reliable smartphone, laptop and home appliance repair services with FixMate.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Navbar />

          <div className="flex-1">{children}</div>

          <Footer />

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
