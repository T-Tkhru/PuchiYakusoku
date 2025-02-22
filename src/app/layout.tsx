"use client";


import LIFFTemplate from "./provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body>
        <LIFFTemplate>{children}</LIFFTemplate>
      </body>
    </html>
  );
}
