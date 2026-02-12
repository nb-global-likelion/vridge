import DashboardSidebar from './dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <DashboardSidebar />
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
