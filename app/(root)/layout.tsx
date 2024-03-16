import MobileNavbar from "@/components/mobile-navbar";
import Navbar from "@/components/navbar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="md:block hidden">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      {children}
    </div>
  );
}
