import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "GPT UI",
  description: "ChatGPT inspired chat interface"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-surface text-gray-100">
      <body className="min-h-screen overflow-hidden">{children}</body>
    </html>
  );
}
