import Navbar from "@/components/navbar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
