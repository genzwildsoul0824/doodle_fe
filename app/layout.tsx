import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat App - Doodle Challenge",
  description: "A simple chat interface for the Doodle frontend challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
