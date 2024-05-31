import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "TeachCO",
  description:
    "Discover TeachCO, the premier online learning platform offering a wide range of expert-led courses to enhance your skills and advance your career. Join thousands of learners achieving their goals with our innovative educational resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className={roboto.className}>
            {children}
            <Toaster />
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
