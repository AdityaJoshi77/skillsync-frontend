
import SideNav from "@/components/SideNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1 min-h-screen bg-gray-800">
        {children}
      </main>
    </div>
  );
}