import MobileNavbar from "@/components/mobile-navbar";
import Navbar from "@/components/navbar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="md:block hidden">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      <main className="flex-grow">{children}</main>
      <footer className="w-full bg-gray-200 py-4">
        <div className="container mx-auto text-center text-gray-700 text-sm">
          &copy; 2024 TeachCO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
