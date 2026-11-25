import type { Metadata } from "next";
import "./globals.css";
import { NavbarCom } from "./_components/NavbarCom";
import { FooterCom } from "./_components/FooterCom";

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
        <NavbarCom />
        {children}
        <FooterCom />
      </body>
    </html>
  );
}
