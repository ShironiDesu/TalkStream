import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TalkStream",
  description: "Text, call, video call app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          'bg-white dark:bg-[#313338]',
          `${geistSans.variable} ${geistMono.variable} antialiased`
        )}
      >
     <ThemeProvider attribute="class" defaultTheme="dark"  enableSystem={false} storageKey="talkstream-theme">
<ModalProvider/>
        {children}
      </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
