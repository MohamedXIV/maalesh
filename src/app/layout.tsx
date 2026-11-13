import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maalesh — Unfortunately, You're Hired",
  description: "A cheerful, fictional hiring agency hiding a cozy comedy life sim. No real jobs, just good nonsense.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
