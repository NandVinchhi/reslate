import type { Metadata } from "next";
import { Providers } from "./providers";
import "regenerator-runtime/runtime";

export const metadata: Metadata = {
  title: "ReSlate - Immersive translation",
  description: "YHack 2024",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
