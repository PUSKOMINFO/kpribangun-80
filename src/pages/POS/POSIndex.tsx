
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Store, 
  Package, 
  Archive, 
  User, 
  History, 
  Receipt,
  BarChart, 
  LineChart 
} from "lucide-react";

export default function POSIndex() {
  const posNavigation = [
    {
      title: "Penjualan",
      icon: Store,
      description: "Transaksi penjualan produk",
      path: "/pos/penjualan",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Daftar Penjualan",
      icon: History,
      description: "Lihat semua transaksi penjualan",
      path: "/pos/penjualan-list",
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Stok Barang",
      icon: Package,
      description: "Kelola stok dan produk",
      path: "/pos/stok",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Inventori",
      icon: Archive,
      description: "Kelola inventaris barang",
      path: "/pos/inventori",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Kasir",
      icon: User,
      description: "Kelola data kasir",
      path: "/pos/kasir",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      title: "Kuitansi",
      icon: Receipt,
      description: "Cetak kuitansi pembayaran",
      path: "/pos/kuitansi",
      color: "bg-rose-100 text-rose-800",
    },
    {
      title: "Laporan Jual Beli",
      icon: BarChart,
      description: "Laporan penjualan dan pembelian",
      path: "/pos/laporan-jual-beli",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Laporan Rugi Laba",
      icon: LineChart,
      description: "Laporan keuangan rugi laba",
      path: "/pos/laporan-rugi-laba",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  return (
    <Layout pageTitle="Point of Sales">
      <h1 className="page-title">Point of Sales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posNavigation.map((item, index) => (
          <Link key={index} to={item.path}>
            <Card className="hover:shadow-md transition-all h-full">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
