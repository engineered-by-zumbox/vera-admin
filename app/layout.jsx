import SWRProviders from "@/context/SWRProvider";
import "./globals.css";
import { Inter } from "next/font/google";

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
      </body>
    </html>
  );
}
