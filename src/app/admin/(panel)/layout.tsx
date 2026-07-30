import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="min-w-0 p-4 md:p-8">{children}</div>
    </div>
  );
}
