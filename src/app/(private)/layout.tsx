import PrivateNavbar from "@/app/components/shared/PrivateNavbar";
import Sidebar from "@/app/components/shared/Sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PrivateNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
