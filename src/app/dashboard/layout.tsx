import AdminTemplate from "@/components/admin-template/app";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <AdminTemplate>
            {children}
        </AdminTemplate>
    )
}
