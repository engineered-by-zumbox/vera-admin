import SWRProviders from "@/context/SWRProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SWRProviders>{children}</SWRProviders>
        <Toaster />
      </body>
    </html>
  );
}
