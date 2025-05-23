
import {
  PiggyBank,
  Users,
  FileText, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  Package,
  Archive, 
  User, 
  History, 
  Receipt, 
  BarChart, 
  LineChart, 
  Store, 
  ShoppingBag, 
  Shield, 
  Database,
  CreditCard, 
  Cog, 
  UserCheck,
  Truck,
  LayoutDashboard,
  Wallet,
  ArrowDown,
  ArrowUp,
  DollarSign
} from "lucide-react";

export type MenuItemType = {
  title: string;
  path: string;
  icon: React.ElementType;
  subItems?: { title: string; path: string; icon: React.ElementType }[];
};

export type MenuSectionType = {
  title: string;
  icon: React.ElementType;
  items: MenuItemType[];
};

export const menuSections: MenuSectionType[] = [
  {
    title: "Menu Utama",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", path: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "Koperasi",
    icon: PiggyBank,
    items: [
      { title: "Data Anggota", path: "/anggota", icon: Users },
      { 
        title: "Transaksi", 
        path: "/transaksi", 
        icon: CreditCard, 
        subItems: [
          { title: "Pengajuan", path: "/transaksi/pengajuan", icon: FileText },
          { title: "Simpan", path: "/transaksi/simpan", icon: FileText },
          { title: "Pinjam", path: "/transaksi/pinjam", icon: FileText },
          { title: "Angsuran", path: "/transaksi/angsuran", icon: FileText }
        ] 
      },
      { title: "Laporan", path: "/laporan", icon: FileText }
    ]
  },
  {
    title: "Keuangan",
    icon: Wallet,
    items: [
      { title: "Transaksi Keuangan", path: "/keuangan/transaksi", icon: DollarSign },
      { title: "Arus Kas", path: "/keuangan/arus-kas", icon: DollarSign },
      { title: "Kategori", path: "/keuangan/kategori", icon: FileText },
      { title: "Laporan Keuangan", path: "/keuangan/laporan", icon: BarChart },
    ]
  },
  {
    title: "KPRI Mart",
    icon: Store,
    items: [
      { title: "Pemasok", path: "/pos/pemasok", icon: Truck },
      { title: "Pembelian", path: "/pos/pembelian", icon: ShoppingCart },
      { title: "Penjualan (PoS)", path: "/pos/penjualan", icon: ShoppingBag },
      { title: "Stok Barang", path: "/pos/stok", icon: Package },
      { title: "Inventori", path: "/pos/inventori", icon: Archive },
      { title: "Nama Kasir", path: "/pos/kasir", icon: User },
      { title: "Riwayat Transaksi", path: "/pos/riwayat", icon: History },
      { title: "Kuitansi / Struk", path: "/pos/kuitansi", icon: Receipt },
      { 
        title: "Laporan", 
        path: "/pos/laporan-jual-beli", 
        icon: BarChart, 
        subItems: [
          { title: "Jual Beli", path: "/pos/laporan-jual-beli", icon: BarChart },
          { title: "Rugi Laba", path: "/pos/laporan-rugi-laba", icon: LineChart }
        ]
      }
    ]
  },
  {
    title: "Pengaturan",
    icon: Settings,
    items: [
      { title: "User Management", path: "/user-management", icon: UserCheck },
      { title: "Hak Akses", path: "/pengaturan/roles", icon: Shield },
      { 
        title: "Koperasi", 
        path: "/pengaturan", 
        icon: Cog, 
        subItems: [
          { title: "Tenor", path: "/pengaturan", icon: Cog },
          { title: "Denda", path: "/pengaturan", icon: Cog },
          { title: "Suku Bunga", path: "/pengaturan", icon: Cog }
        ]
      },
      { title: "Backup Data", path: "/pengaturan/backup", icon: Database }
    ]
  }
];
