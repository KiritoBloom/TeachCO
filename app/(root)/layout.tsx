import MobileNavbar from "@/components/mobile-navbar";
import Navbar from "@/components/navbar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="lg:block sm:hidden hidden">
        <Navbar />
      </div>
      <div className="block sm:block lg:hidden">
        <MobileNavbar />
      </div>
      <main className="flex-grow dark:bg-[#18181B]">{children}</main>
      <footer className="w-full bg-gray-200 py-4 dark:bg-[#18181B]">
        <div className="container mx-auto text-center text-gray-700 dark:text-primary/90 text-sm">
          &copy; 2024 TeachCO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
