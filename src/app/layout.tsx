import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "English Speaking Club",
  description:
    "English Speaking Club is a platform for English learners to practice speaking English with other learners."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
