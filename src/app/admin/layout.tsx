import Sidebar from "@/Sidebar";

export const metadata = {
  title: "Admin Panel",
  description: "Manage your products and categories",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
