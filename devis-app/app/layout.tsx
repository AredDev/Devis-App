import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const baiJamjuree = localFont({
  src: [
    {
      path: "../public/police/BaiJamjuree-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/police/BaiJamjuree-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-baijamjuree",
});

export const metadata: Metadata = {
  title: "BioControl — Portail de Gestion & Devis",
  description: "Prototype haut de gamme de formulaire de devis et back-office de suivi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${baiJamjuree.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

