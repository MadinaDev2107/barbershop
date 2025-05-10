import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";

export const metadata: Metadata = {
  title: "Barberbook",
  description: "Erkaklar uchun qulaylik – endi cho‘ntagida!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
