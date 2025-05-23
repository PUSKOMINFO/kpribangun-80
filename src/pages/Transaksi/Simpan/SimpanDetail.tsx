
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransaksiById, getAnggotaById } from "@/adapters/serviceAdapters";
import { Anggota, Transaksi } from "@/types";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ReceiptDialog } from "@/components/transaksi/receipt/ReceiptDialog";
import { useAsync } from "@/hooks/use-async";

export default function SimpanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const { data: transaksi, loading: loadingTransaksi, error: transaksiError } = useAsync(
    async () => id ? await getTransaksiById(id) : undefined,
    null,
    [id]
  );

  const { data: anggota, loading: loadingAnggota } = useAsync(
    async () => transaksi ? await getAnggotaById(transaksi.anggotaId) : undefined,
    null,
    [transaksi]
  );

  // Handle errors
  useEffect(() => {
    if (transaksiError) {
      toast({
        title: "Data tidak ditemukan",
        description: `Simpanan dengan ID ${id} tidak ditemukan`,
        variant: "destructive",
      });
      navigate("/transaksi/simpan");
    }
  }, [transaksiError, id, navigate, toast]);

  const handlePrintReceipt = () => {
    navigate(`/transaksi/${id}/cetak`);
  };
  
  const handleShowReceipt = () => {
    setIsReceiptOpen(true);
  };

  const loading = loadingTransaksi || loadingAnggota;

  if (loading) {
    return (
      <Layout pageTitle="Detail Simpanan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  if (!transaksi || transaksi.jenis !== "Simpan") {
    return (
      <Layout pageTitle="Detail Simpanan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data simpanan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Simpanan">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/transaksi/simpan">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Detail Simpanan</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShowReceipt}>
            <FileText size={16} className="mr-2" />
            Lihat Bukti
          </Button>
          <Button size="sm" onClick={handlePrintReceipt}>
            <Printer size={16} className="mr-2" />
            Cetak Bukti
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Transaksi Simpanan #{transaksi.id}</span>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                  transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"
                }`}>
                  {transaksi.status}
                </span>
              </CardTitle>
              <CardDescription>
                Tanggal Transaksi: {formatDate(transaksi.tanggal)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informasi Simpanan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Transaksi</p>
                    <p className="font-medium">
                      <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Simpanan
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah</p>
                    <p className="font-medium">
                      {formatCurrency(transaksi.jumlah)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {anggota && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informasi Anggota</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Anggota</p>
                      <p className="font-medium">{anggota.nama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Anggota</p>
                      <p className="font-medium">{anggota.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">No. Telepon</p>
                      <p className="font-medium">{anggota.noHp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium">{anggota.alamat}</p>
                    </div>
                  </div>
                </div>
              )}

              {transaksi.keterangan && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
                    <p className="text-gray-700">{transaksi.keterangan}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
              <CardDescription>
                Detail transaksi simpanan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID Transaksi</p>
                  <p className="font-medium">{transaksi.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                  <p className="font-medium">{formatDate(transaksi.createdAt)}</p>
                </div>
                {transaksi.createdAt !== transaksi.updatedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Terakhir Diubah</p>
                    <p className="font-medium">{formatDate(transaksi.updatedAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {transaksi && (
        <ReceiptDialog 
          open={isReceiptOpen} 
          onOpenChange={setIsReceiptOpen} 
          transaksi={transaksi} 
        />
      )}
    </Layout>
  );
}
