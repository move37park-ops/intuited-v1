import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INTUITED | Collective Intuition System",
  description: "Harness collective intuition to predict market movements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased select-none">
        {children}
      </body>
    </html>
  );
}

