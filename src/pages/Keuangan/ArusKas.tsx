
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, BarChart, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { subDays } from 'date-fns';

import { PemasukanPengeluaran } from '@/types';
import { useKeuanganTransaksi } from '@/hooks/useKeuanganTransaksi';

import TransaksiTable from '@/components/keuangan/TransaksiTable';
import TransaksiForm from '@/components/keuangan/TransaksiForm';
import { DeleteConfirmDialog } from '@/components/keuangan/DeleteConfirmDialog';
import { TransaksiDetailDialog } from '@/components/keuangan/TransaksiDetailDialog';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export default function ArusKas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("pemasukan");
  
  const {
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    calculateTotal,
    loadTransactions,
    deleteTransaction
  } = useKeuanganTransaksi(activeTab === "pemasukan" ? "Pemasukan" : "Pengeluaran");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PemasukanPengeluaran | null>(null);

  // Initialize default date range if not set
  React.useEffect(() => {
    if (!dateRange) {
      setDateRange({
        from: subDays(new Date(), 30),
        to: new Date(),
      });
    }
  }, [dateRange, setDateRange]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadTransactions(value === "pemasukan" ? "Pemasukan" : "Pengeluaran");
  };

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle transaction view
  const handleViewTransaction = (transaction: PemasukanPengeluaran) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };
  
  // Redirect to detail view
  const handleDetailView = (transaction: PemasukanPengeluaran) => {
    const route = transaction.jenis === "Pemasukan" 
      ? `/keuangan/pemasukan/${transaction.id}` 
      : `/keuangan/pengeluaran/${transaction.id}`;
    navigate(route);
  };
  
  // Handle transaction edit
  const handleEditTransaction = (transaction: PemasukanPengeluaran) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };
  
  // Handle transaction delete prompt
  const handleDeletePrompt = (transaction: PemasukanPengeluaran) => {
    setSelectedTransaction(transaction);
    setIsDeleteOpen(true);
  };
  
  // Handle transaction delete confirm
  const confirmDelete = async () => {
    if (selectedTransaction) {
      const success = await deleteTransaction(selectedTransaction.id);
      if (success) {
        setIsDeleteOpen(false);
      }
    }
  };

  // Form success handler
  const handleFormSuccess = () => {
    loadTransactions(activeTab === "pemasukan" ? "Pemasukan" : "Pengeluaran");
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <Layout pageTitle="Arus Kas">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Arus Kas</h1>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate('/keuangan/laporan')}>
              <BarChart className="h-4 w-4 mr-2" />
              Laporan
            </Button>
            <Button 
              onClick={() => {
                // Set default transaction type based on active tab
                setIsFormOpen(true);
                setSelectedTransaction({
                  id: "",
                  jenis: activeTab === "pemasukan" ? "Pemasukan" : "Pengeluaran",
                  tanggal: format(new Date(), 'yyyy-MM-dd'),
                  kategori: "",
                  jumlah: 0,
                  keterangan: "",
                  createdAt: "",
                  updatedAt: ""
                } as PemasukanPengeluaran);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === "pemasukan" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <TabsList>
              <TabsTrigger value="pemasukan" className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4" />
                <span>Pemasukan</span>
              </TabsTrigger>
              <TabsTrigger value="pengeluaran" className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                <span>Pengeluaran</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari transaksi..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <DateRangePicker
                value={dateRange}
                onValueChange={setDateRange}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
          
          <TabsContent value="pemasukan" className="space-y-4">
            {/* Summary Card for Pemasukan */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ArrowUp className="h-5 w-5 text-blue-600" />
                  <span>Total Pemasukan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(calculateTotal())}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Periode: {
                    dateRange?.from && dateRange?.to ?
                    `${format(dateRange.from, 'dd MMM yyyy', { locale: idLocale })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: idLocale })}` :
                    'Semua waktu'
                  }
                </p>
              </CardContent>
            </Card>
            
            {/* Transactions Table */}
            <TransaksiTable
              data={filteredTransactions}
              onView={handleDetailView}
              onEdit={handleEditTransaction}
              onDelete={handleDeletePrompt}
            />
          </TabsContent>
          
          <TabsContent value="pengeluaran" className="space-y-4">
            {/* Summary Card for Pengeluaran */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ArrowDown className="h-5 w-5 text-red-600" />
                  <span>Total Pengeluaran</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(calculateTotal())}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Periode: {
                    dateRange?.from && dateRange?.to ?
                    `${format(dateRange.from, 'dd MMM yyyy', { locale: idLocale })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: idLocale })}` :
                    'Semua waktu'
                  }
                </p>
              </CardContent>
            </Card>
            
            {/* Transactions Table */}
            <TransaksiTable
              data={filteredTransactions}
              onView={handleDetailView}
              onEdit={handleEditTransaction}
              onDelete={handleDeletePrompt}
            />
          </TabsContent>
        </Tabs>
        
        {/* Transaction Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction?.id ? "Edit Transaksi" : activeTab === "pemasukan" ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
              </DialogTitle>
            </DialogHeader>
            <TransaksiForm
              initialData={selectedTransaction || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Transaction Detail Dialog */}
        <TransaksiDetailDialog
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          transaction={selectedTransaction}
        />
        
        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          transaction={selectedTransaction}
        />
      </div>
    </Layout>
  );
}
