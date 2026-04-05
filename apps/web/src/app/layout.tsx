import "./globals.css";
import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/layout/Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
