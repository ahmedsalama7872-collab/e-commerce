import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

export const metadata: Metadata = {
  title: "FreshCart | Fresh groceries, delivered",
  description: "Shop fresh groceries and everyday essentials with FreshCart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <Suspense fallback={null}><ScrollToTop /></Suspense>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
